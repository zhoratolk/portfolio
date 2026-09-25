# Excerpt from a private repository (ops/deploy_agent.py).
# Pull-based deploy agent: systemd timer every 3 min, deploys the `green` branch, health-checks, rolls back.
# Trimmed for the portfolio: helpers and config loading are omitted; logic is unchanged.

DEPLOY_REF = "green"          # moved by CI only after the test suite passes
SERVICES = ["worker", "bot"]
HEALTH_TIMEOUT = 120
HEALTH_POLL = 5


def should_deploy(current: str | None, target: str | None, busy: list[int]) -> bool:
    if not target or not current:
        return False
    if target == current:
        return False
    return not busy


def checkout(sha: str, repo_dir: str = REPO_DIR, runner=run) -> tuple[bool, str]:
    """Move the working tree onto a commit, discarding local edits to tracked files.

    Hard rather than a merge, because this clone is a deploy target and not a place
    anybody should be writing code. Untracked files are untouched, which is what keeps
    .env and docker-compose.override.yml - neither is in git - exactly where they are.
    """
    code, out = runner(git_command(repo_dir, "reset", "--hard", sha),
                       cwd=repo_dir, timeout=120)
    return code == 0, out


# How long a build may take before it is treated as hung rather than slow.
#
# An hour was the number until a cold build met a slow evening and lost. The image pulls
# about four gigabytes of wheels; on a good day that is ten minutes, and on 08.09.2026 the
# link was giving under half a megabyte a second, which turns the same download into two
# and a half hours. The build was killed at sixty minutes, rolled back, and started again
# from nothing on the next tick - an hour of work discarded every hour, indefinitely.
#
# Four hours is chosen to be longer than the worst cold build actually observed here, not
# as a round number. It is a ceiling on a hang, not a schedule: a warm build still takes
# a couple of minutes, and the deploy is not holding anything up while it runs - the old
# containers keep serving until the new ones answer.
BUILD_TIMEOUT = int(os.environ.get("DEPLOY_BUILD_TIMEOUT", "14400"))


def bring_up(repo_dir: str = REPO_DIR, runner=run) -> tuple[bool, str]:
    code, out = runner(
        ["docker", "compose", "build", *SERVICES], cwd=repo_dir, timeout=BUILD_TIMEOUT
    )
    if code != 0:
        return False, out[-2000:]
    code, out = runner(
        ["docker", "compose", "up", "-d", *SERVICES], cwd=repo_dir, timeout=600
    )
    return code == 0, out[-2000:]


def containers_running(repo_dir: str = REPO_DIR, runner=run) -> list[str]:
    """Which of our services docker currently reports as running."""
    code, out = runner(
        ["docker", "compose", "ps", "--services", "--filter", "status=running"],
        cwd=repo_dir, timeout=60,
    )
    return out.split() if code == 0 else []


def healthy(repo_dir: str = REPO_DIR, runner=run, timeout: int = HEALTH_TIMEOUT,
            poll: int = HEALTH_POLL, sleep=time.sleep, now=time.monotonic) -> bool:
    """Both services up and staying up.

    Polled rather than checked once, because a container that crashes on start does not
    fail `up -d` - the command succeeds, the process dies a second later, and docker
    restarts it in a loop. Asking once, immediately, would call that a successful deploy.
    """
    deadline = now() + timeout
    while now() < deadline:
        running = containers_running(repo_dir, runner)
        if all(service in running for service in SERVICES):
            # Seen up once. Look again after a beat: a crash loop is up, down, up.
            sleep(poll)
            running = containers_running(repo_dir, runner)
            if all(service in running for service in SERVICES):
                return True
        sleep(poll)
    return False



def deploy(repo_dir: str = REPO_DIR, runner=run, health=healthy, ops=install_ops) -> int:
    previous = current_sha(repo_dir, runner)
    target = fetch_target(repo_dir, DEPLOY_REF, runner)
    busy = busy_jobs()

    if not should_deploy(previous, target, busy):
        # One line per tick, always. Three minutes of silence and "nothing to do" looked
        # identical in the journal to three minutes of silence and "the fetch is broken",
        # which cost an evening of guessing at which one it was.
        print(
            f"deploy: nothing to do (at {short(previous)}, {DEPLOY_REF} is {short(target)}"
            + (f", job(s) {busy} running" if busy else "")
            + ")",
            file=sys.stderr,
        )
        return 0

    print(f"deploy: {short(previous)} -> {short(target)}", file=sys.stderr)

    moved, out = checkout(target, repo_dir, runner)
    if not moved:
        announce(f"⚠️ Обновление не встало: не удалось переключиться на {short(target)}.")
        print(out, file=sys.stderr)
        return 1

    built, out = bring_up(repo_dir, runner)
    if built and health(repo_dir, runner):
        refreshed, detail = ops(repo_dir)
        print(f"deploy: {detail}", file=sys.stderr)
        if refreshed:
            announce(f"🚀 Обновление {short(target)} на сервере, всё поднялось.")
        else:
            # The service is up and stays up; only the watchdog and timers are behind.
            # Not a rollback - the containers are fine - but not silence either, or the
            # next fix to the watchdog goes missing the same way the last two did.
            announce(
                f"🚀 Обновление {short(target)} на сервере, сервис поднялся, но сторож и "
                f"таймеры остались на старом коде: {detail}"
            )
        return 0

    # Rolling back is the whole reason this is allowed to run unattended. A deploy that
    # cannot undo itself is not automation, it is a scheduled outage.
    print(f"deploy: {short(target)} did not come up, rolling back to {short(previous)}",
          file=sys.stderr)
    print(out, file=sys.stderr)
    restored, _ = checkout(previous, repo_dir, runner)
    recovered = restored and bring_up(repo_dir, runner)[0] and health(repo_dir, runner)

    if recovered:
        announce(
            f"↩️ Обновление {short(target)} не поднялось — откатился на {short(previous)}, "
            "сервис работает. Смотреть логи сборки на сервере."
        )
    else:
        announce(
            f"🔴 Обновление {short(target)} не поднялось И откат на {short(previous)} тоже. "
            "Сервис лежит, нужны руки."
        )
    return 1


