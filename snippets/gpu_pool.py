# Excerpt from a private repository (worker/gpu_pool.py).
# GPU lease pool shared between a paid queue and a personal pipeline: mtime-heartbeat claims, least-loaded placement.
# Trimmed for the portfolio: helpers and config loading are omitted; logic is unchanged.

def read_claims(directory: str, now: float | None = None) -> dict[int, str]:
    """Which cards are currently spoken for, by name.

    A claim is a file named `gpu<N>` whose modification time is its heartbeat: the holder
    touches it while it works, and stops when it stops. Freshness is judged by mtime
    rather than by anything inside the file, so a borrower that dies mid-write cannot
    leave behind a claim that outlives it - and a borrower written in any language can
    hold a card with `touch`.

    The contents are read only to name the holder in the log. An unreadable or empty file
    is still a valid claim: what the card is being used for is a nicety, that it is being
    used is the fact.
    """
    now = time.time() if now is None else now
    claimed: dict[int, str] = {}
    try:
        entries = os.scandir(directory)
    except OSError:
        # A missing or unreadable directory means nothing is borrowed. This is the state
        # on a machine where the personal pipeline was never set up, so it is a normal
        # answer rather than a problem worth logging every five seconds.
        return {}

    with entries:
        for entry in entries:
            if not entry.name.startswith("gpu"):
                continue
            try:
                index = int(entry.name[3:].split(".")[0])
                age = now - entry.stat().st_mtime
            except (ValueError, OSError):
                continue
            if age > CLAIM_STALE_SECONDS:
                continue
            owner = ""
            try:
                with open(entry.path, encoding="utf-8") as f:
                    owner = f.read(200).strip()
            except OSError:
                pass
            claimed[index] = owner or "unnamed"
    return claimed


def claimed_devices() -> frozenset[int]:
    """The borrowed cards, re-read at most every few seconds."""
    global _claims_cache
    directory = claims_dir()
    if directory is None:
        return frozenset()

    now = time.time()
    if _claims_cache is not None and now - _claims_cache[0] < _CLAIM_CACHE_TTL:
        return _claims_cache[1]

    claims = read_claims(directory, now)
    current = frozenset(claims)
    if _claims_cache is None or _claims_cache[1] != current:
        if claims:
            logger.info(
                "GPU %s on loan (%s) - the queue will prefer the rest",
                ", ".join(str(index) for index in sorted(claims)),
                ", ".join(sorted(set(claims.values()))),
            )
        elif _claims_cache is not None:
            logger.info("all GPUs back in the pool")
    _claims_cache = (now, current)
    return current


def choose_device(device_list: list[int], load: dict[int, int],
                  claimed: frozenset[int] | set[int]) -> int | None:
    """The card a new lease should run on.

    Borrowed cards are stepped over while there is anything else, which is the whole
    point: a card nobody is using belongs to the queue, and a card somebody took back
    stops being offered without anything being interrupted.

    When every card is claimed the claims are ignored and the least loaded one is used
    anyway. A claim is a request for exclusivity, not a lock - refusing to run would turn
    a borrowed card into an outage for paying work, while sharing one only makes both
    sides slower. The worst case here is a slowdown, and it has to stay that way.
    """
    if not device_list:
        return None
    free = [device for device in device_list if device not in claimed]
    return min(free or device_list, key=lambda device: load.get(device, 0))



class _Pool:
    """A global slot count, plus a running tally of what each card is carrying.

    The tally is what spreads the work: a lease goes to whichever device is currently
    least loaded, so the cards stay within one job of each other without any scheduling
    beyond a min(). Round-robin would drift as soon as clip lengths differed.
    """

    def __init__(self, capacity: int, device_list: list[int]):
        self.capacity = capacity
        self.devices = device_list
        self._semaphore = asyncio.Semaphore(capacity)
        self._load = {device: 0 for device in device_list}

    def _least_loaded(self) -> int | None:
        if not self.devices:
            return None
        # No await between this read and the increment below, so the event loop cannot
        # interleave a second lease onto the same answer.
        return choose_device(self.devices, self._load, claimed_devices())

    @asynccontextmanager
    async def slot(self):
        await self._semaphore.acquire()
        device = self._least_loaded()
        if device is not None:
            self._load[device] += 1
        try:
            yield device
        finally:
            if device is not None:
                self._load[device] -= 1
            self._semaphore.release()

    def load(self) -> dict[int, int]:
        return dict(self._load)


# One pool per event loop. asyncio primitives bind to the loop that first awaits them, and
# the test suite runs many independent asyncio.run() calls; a single module-level
# Semaphore would carry waiters from a closed loop into the next one. Weak keys so a
# finished loop's pool is collected with it.
_pools: "weakref.WeakKeyDictionary" = weakref.WeakKeyDictionary()


def _pool() -> _Pool:
    loop = asyncio.get_running_loop()
    pool = _pools.get(loop)
    if pool is None:
        pool = _Pool(render_parallelism(), devices())
        _pools[loop] = pool
    return pool


@asynccontextmanager
async def lease(label: str = "gpu"):
    """Waits for a free slot, binds this task to a card, and yields its index (or None).

    Everything downstream reads the binding through `current_device()`, so the caller does
    not have to pass it anywhere.
    """
    pool = _pool()
    async with pool.slot() as device:
        token = _current_device.set(device)
        try:
            if device is not None:
                logger.debug("%s: leased GPU %d", label, device)
            yield device
        finally:
            _current_device.reset(token)

