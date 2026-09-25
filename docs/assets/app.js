(() => {
  "use strict";

  const REPO = "https://github.com/zhoratolk/portfolio";
  const caseUrl = (slug, lang) => `${REPO}/blob/main/cases/${lang === "en" ? "en/" : ""}${slug}.md`;

  /* ---------------- i18n: RU lives in the HTML, EN here ---------------- */
  const EN = {
    "skip": "Skip to content",
    "nav.infra": "Infrastructure", "nav.agents": "Agents", "nav.repo": "Portfolio repository on GitHub", "nav.projects": "Projects", "nav.pm": "Postmortems", "nav.stack": "Stack", "nav.contact": "Contact",
    "hero.eyebrow": "Open to offers · DevOps / MLOps / AI",
    "hero.h1a": "Infrastructure",
    "hero.h1b": "that LLMs run on",
    "hero.lead": "I'm Georgy Tolkachev. I build and run GPU infrastructure for AI products: hardware and Ansible, unattended deploys with rollback, monitoring, and model quality evaluation. Everything below is live. None of it is a tutorial project.",
    "hero.cta1": "See projects", "hero.cta2": "Case studies on GitHub",
    "term.aria": "Log of an automatic deploy with rollback",
    "stats.aria": "Numbers",
    "stats.s1": "services in production on my own GPU server",
    "stats.s2": "automated tests across projects",
    "stats.s3": "commits in 2026 so far",
    "stats.s4": "cost to process a 3-hour recording (≈ $0.13)",
    "what.k": "What I do", "what.h": "Three tracks, one machine",
    "what.sub": "Infrastructure, ML pipelines and LLM systems. Each one has run under real load, not on a demo bench.",
    "p1.h": "Infrastructure & operations", "p1.p": "Server as code, unattended deploys, survival under failure.",
    "p1.l1": "Ansible: 8 roles, <code>changed=0</code> on the live host", "p1.l2": "Pull-based deploy with health checks and rollback", "p1.l3": "Watchdog, dead-man switch, 3-2-1 backups",
    "p2.h": "GPU & ML pipelines", "p2.p": "Transcription, diarization and video rendering on two cards.",
    "p2.l1": "faster-whisper large-v3 + pyannote at ~14× real time", "p2.l2": "GPU leasing between projects that share no code", "p2.l3": "NVENC session budget, CDI, models pinned by hash",
    "p3.h": "LLM & agent systems", "p3.p": "Models where they help, deterministic code where precision matters.",
    "p3.l1": "Circuit breaker and cost-aware routing", "p3.l2": "Eval harness: invariants and baseline in CI", "p3.l3": "Agent swarm with a review quorum, human in the loop",
    "infra.k": "Flagship", "infra.h": "A home GPU server, written down as code",
    "infra.sub": "Two RTX 3060s, three projects and no shared scheduler. Cards are shared through claim files kept fresh by mtime, deploys go through git, and an external watchdog reports when the machine dies.",
    "dg.ws": "WORKSTATION · WINDOWS", "dg.obs": "stream recordings", "dg.outside": "OUTSIDE · INTERNET", "dg.users": "Katch customers", "dg.users2": "talk to the Telegram bot",
    "dg.srv": "GPU SERVER · UBUNTU 26.04 · ANSIBLE", "dg.katch": "Katch", "dg.katch2": "SaaS · bot + worker", "dg.shorts2": "ingest · render",
    "dg.zapoy": "Zapoy", "dg.vtube2": "guest volume",
    "dg.claims": "gpu-claims: claim = file, fresh by mtime → lease()",
    "dg.gpu0": "paid queue only", "dg.gpu1": "hybrid: queue + personal jobs", "dg.samba": "recordings · clips",
    "dg.ci": "tests → green branch", "dg.gist": "Secret gist", "dg.gist2": "heartbeat: &lt;epoch&gt; ok|fail",
    "dg.dm": "Dead-man cron", "dg.dm2": "silence > 30 min → alert", "dg.tg": "Telegram alerts",
    "dg.cloud": "Cloud · backups", "dg.cloud2": "clips 48 h · 3-2-1", "dg.yt": "publishing · retention",
    "lg.deploy": "git deploy & heartbeat", "lg.data": "recordings over SMB", "lg.iac": "configuration via Ansible", "lg.users": "user traffic", "lg.alert": "death alert",
    "ag.k": "Agent systems", "ag.h": "Agents don't get taken at their word",
    "ag.sub": "swarm-orchestrator is a swarm of models from different families. A goal is split into tasks, every artifact goes through a review quorum, and work is accepted only after a real verification command runs on the machine. The swarm has already written code in two of my projects, in isolated worktrees and under human review.",
    "ag.goal": "Goal", "ag.mgr": "Manager", "ag.mgr2": "tasks, board, plan", "ag.disp": "Dispatcher", "ag.disp2": "the only spawner",
    "ag.aud": "Spawn auditor", "ag.aud2": "limits + veto", "ag.wave": "WAVE · IN PARALLEL", "ag.w1": "researchers", "ag.w2": "implementers", "ag.w3": "reconcilers",
    "ag.q": "Quorum ≥3", "ag.q2": "any reject blocks", "ag.acc": "Acceptor",
    "ag.back": "findings → replan · 3 stalled iterations → stop",
    "ag.c1h": "Swarm → PR, not main", "ag.c1p": "The swarm works in an isolated git worktree on its own branch. A human reads the diff before merging. Commands written by a model don't run without explicit permission.",
    "ag.c2h": "LangGraph + interrupt()", "ag.c2p": "AIkimat: a letter to a citizen doesn't go out until a human presses approve. The graph stops and waits; the decision goes to the audit log.",
    "ag.c3h": "Tools with a risk level", "ag.c3p": "Zapoy: a risky call waits for an “Allow” button in a push notification. A red-team checks whether a locked tool runs after a poisoned page.",
    "ag.note": "Honest about limits: the swarm's free gateway depends on the network. When models return 403 or 429, the swarm stops on a stall instead of passing off an empty result as done.",
    "ml.h": "The model lifecycle: from data to fine-tuning",
    "ml.sub": "A model isn't just “plugged in”, it is run: chosen on my own data, version-pinned, served on real hardware, measured for quality and cost, with the signal fed back into the data. Every step below comes from a working project.",
    "ml.1h": "Data", "ml.1p": "dataset_log from day one, raw model answers, retention",
    "ml.2h": "Selection", "ml.2p": "a model bake-off on a real recording, through the same code as prod",
    "ml.3h": "Versions", "ml.3p": "revision hash, weights on a volume, hub offline mode",
    "ml.4h": "Serving", "ml.4p": "GPU leasing, NVENC budget, embeddings on CPU, GBNF",
    "ml.5h": "Evaluation", "ml.5p": "invariants and baseline in CI, a tool-selection eval over 167 cases",
    "ml.6h": "Loop", "ml.6p": "retention changes the config; an RVC voice model fine-tuned",
    "bo.h": "Bake-off: 7 models on one 4.6 h recording",
    "bo.p": "Cost to process the whole recording. On the right: moments that survived the filter and run time in seconds. A ~70× cost spread; the decision came from reading the found moments as a human, and from price.",
    "ml.c1h": "RAG: hybrid, not “just vectors”", "ml.c1p": "BGE-M3 gives dense and sparse in one pass, Qdrant fuses them with RRF. A threshold only on the dense branch, semantic fact deduplication, a 200 ms budget.",
    "ml.c2h": "Fine-tuning: a voice for anime shorts", "ml.c2p": "Silero vs XTTS vs RVC. 83 fragments of my voice, fine-tuned from HiFi-GAN, 59 epochs on a GTX 1650, best checkpoint by loss, an overtraining detector. Didn't ship: the live voice turned out better.",
    "ml.c3h": "Rejections with numbers", "ml.c3p": "A local qwen3-32b cut moments before the punchline while a cloud flash model costs cents per recording, so self-hosting the LLM was rejected. The decision is recorded with the measurements.",
    "ml.link": "Full MLOps case study →", "ml.link2": "RAG and memory →", "ml.link3": "CI/CD →",
    "pr.k": "Principles", "pr.h": "How I make engineering decisions",
    "pr.1h": "Check by fact", "pr.1p": "Not by exit code. An upload with exit code 0 once uploaded nothing.",
    "pr.2h": "Model or code", "pr.2p": "A model where semantics are needed, code where precision is. Estimate figures are not trusted to an LLM.",
    "pr.3h": "Own data", "pr.3p": "A model is chosen by a bake-off on a real recording, not by a leaderboard.",
    "pr.4h": "Rollback over deploy", "pr.4p": "A deploy without rollback is a scheduled outage. “Tested” is a git ref.",
    "pr.5h": "Medians", "pr.5p": "Not averages: one long stream drags the average to where no job ever was.",
    "pr.6h": "An honest boundary", "pr.6p": "What I operate, what I designed and what I'm learning are kept apart. Negative results get written down too.",
    "pipe.h": "A deploy you can leave alone",
    "pipe.1h": "Push", "pipe.1p": "PR or master, never straight to prod",
    "pipe.2h": "CI", "pipe.2p": "2,200+ tests plus an offline eval of LLM moment selection",
    "pipe.3h": "green", "pipe.3p": "fast-forwarded only when CI is green",
    "pipe.4h": "Pull", "pipe.4p": "the server fetches every 3 min, if the queue is idle",
    "pipe.5h": "Health", "pipe.5p": "services up and staying up: checked twice with a pause",
    "pipe.6h": "Rollback", "pipe.6p": "didn't come up → previous SHA and an alert",
    "pipe.note": "No open ports, webhooks or tokens on the server: all it needs is <code>git fetch</code>. Here “tested” is a git ref, not a phrase in a commit message.",
    "proj.k": "Projects", "proj.h": "Case studies with architecture, numbers and scars",
    "proj.sub": "Most of the code is private. Each case study covers the problem, architecture, engineering decisions, incidents and honest limitations. Sanitized code excerpts are in the repo.",
    "proj.filter": "Filter projects",
    "pm.k": "Postmortems", "pm.h": "What broke and how it was found",
    "pm.sub": "The core operations skill is chasing a failure down to its cause, not just until the symptom goes away. A few stories from the log.",
    "st.k": "Stack", "st.h": "Honest, by level",
    "ct.h": "Looking for a team where infrastructure is the product",
    "ct.sub": "ML platform, inference or SRE. Based in Saint Petersburg, remote or hybrid, open to relocating to Almaty.",
    "ct.repo": "Portfolio repository",
    "ft.l": "© 2026 Georgy Tolkachev · static site, no frameworks",
    "open": "Read the case study", "code": "Public repo", "private": "private", "public": "public",
  };

  const RU = { "open": "Читать кейс", "code": "Публичный репо", "private": "приватный", "public": "публичный" };

  const FILTERS = [
    { id: "all", ru: "Все", en: "All" },
    { id: "ops", ru: "DevOps / SRE", en: "DevOps / SRE" },
    { id: "ml", ru: "ML / GPU", en: "ML / GPU" },
    { id: "ai", ru: "LLM / AI", en: "LLM / AI" },
    { id: "design", ru: "Архитектура", en: "Architecture" },
    { id: "app", ru: "Приложения", en: "Apps" },
  ];

  const PROJECTS = [
    {
      slug: "ml-lifecycle", cat: ["ml", "ai", "ops"], tag: "ml", featured: true,
      ru: { t: "MLOps: полный цикл модели", d: "Датасет с первого дня, бейк-офф 7 моделей на своих данных, версии по хэшу, раздача на GPU, три слоя оценки, мониторинг стоимости, петля от аналитики и дообучение голосовой модели RVC." },
      en: { t: "MLOps: the full model lifecycle", d: "A dataset from day one, a bake-off of 7 models on my own data, versions pinned by hash, GPU serving, three evaluation layers, cost monitoring, an analytics feedback loop and fine-tuning an RVC voice model." },
      m: [["7", { ru: "моделей в бейк-оффе", en: "models in the bake-off" }], ["~70×", { ru: "разброс цены", en: "cost spread" }], ["167", { ru: "eval-кейсов", en: "eval cases" }]],
      s: ["bake-off", "eval harness", "RVC", "llama.cpp", "GBNF"],
    },
    {
      slug: "rag", cat: ["ai"], tag: "ai",
      ru: { t: "RAG и память", d: "Гибридный поиск BGE-M3 + Qdrant (dense + sparse, RRF), трёхуровневая память ассистента, семантическая дедупликация, цитирование источников." },
      en: { t: "RAG and memory", d: "Hybrid search with BGE-M3 + Qdrant (dense + sparse, RRF), three-level assistant memory, semantic deduplication, source citations." },
      m: [[{ ru: "200 мс", en: "200 ms" }, { ru: "бюджет ретривера", en: "retriever budget" }]],
      s: ["BGE-M3", "Qdrant", "RRF", "SQLite"],
    },
    {
      slug: "ci-cd", cat: ["ops"], tag: "ops",
      ru: { t: "CI/CD", d: "Ветка green как контракт доставки, pull-деплой с откатом, eval-гейт LLM в CI, матрица Windows + Linux, сторож на Actions, дрейф Ansible." },
      en: { t: "CI/CD", d: "The green branch as a delivery contract, pull deploy with rollback, an LLM eval gate in CI, a Windows + Linux matrix, a watchdog on Actions, Ansible drift." },
      m: [["0", { ru: "открытых портов для деплоя", en: "open ports for deploys" }]],
      s: ["GitHub Actions", "systemd", "gitleaks", "Ansible"],
    },
    {
      slug: "gpu-server", cat: ["ops", "ml"], tag: "ops",
      ru: { t: "Домашний GPU-сервер как код", d: "Железо посчитано до покупки, 8 ролей Ansible, файрвол, который не отрезает сам себя, протокол аренды GPU, дедман-свич, бэкапы 3-2-1 и постмортемы трёх «тихих» смертей." },
      en: { t: "Home GPU server as code", d: "Hardware sized before purchase, 8 Ansible roles, a firewall that can't lock itself out, a GPU leasing protocol, a dead-man switch, 3-2-1 backups and postmortems of three silent deaths." },
      m: [["2×", "RTX 3060"], ["8", { ru: "ролей Ansible", en: "Ansible roles" }], ["3", { ru: "сервиса в проде", en: "prod services" }]],
      s: ["Ubuntu 26.04", "Ansible", "Docker", "CDI", "systemd", "ufw", "Tailscale"],
    },
    {
      slug: "katch", cat: ["ops", "ml", "ai"], tag: "ops",
      ru: { t: "Катч — SaaS нарезки стримов", d: "Telegram-сервис: VOD → шортсы 9:16. Pull-деплой с откатом, NVENC-бюджет, circuit breaker, eval harness, метрики стоимости." },
      en: { t: "Katch — stream-to-shorts SaaS", d: "Telegram service: VOD → 9:16 shorts. Pull deploy with rollback, NVENC budget, circuit breaker, eval harness, cost metrics." },
      m: [["2 200+", { ru: "тестов", en: "tests" }], ["~11 ₽", { ru: "за 3 ч записи", en: "per 3 h VOD" }]],
      s: ["aiogram", "faster-whisper", "pyannote", "ffmpeg/NVENC", "GitHub Actions"],
    },
    {
      slug: "shorts-maker", cat: ["ml", "ops"], tag: "ml",
      ru: { t: "Shorts-Maker", d: "Продакшен-пайплайн канала: whisper и диаризация на сервере, рендер на NVENC, публикация через YouTube API. Аналитика досмотров меняет конфиг нарезки." },
      en: { t: "Shorts-Maker", d: "Production pipeline for a channel: whisper and diarization on the server, NVENC rendering, publishing via the YouTube API. Retention analytics feed back into the cutting config." },
      m: [["1 260+", { ru: "тестов", en: "tests" }], ["~14×", { ru: "реального времени", en: "real time" }]],
      s: ["whisper large-v3", "pyannote 4", "YouTube API", "systemd timers"],
    },
    {
      slug: "swarm-orchestrator", cat: ["ai"], tag: "ai", pub: "https://github.com/zhoratolk/swarm-orchestrator",
      ru: { t: "swarm-orchestrator", d: "Рой LLM-агентов разных моделей: кворум ревью из ≥3 моделей, приёмка через реальный verify_cmd, фильтр секретов, учёт стоимости, защита от command injection." },
      en: { t: "swarm-orchestrator", d: "A swarm of LLM agents across model families: a review quorum of ≥3 models, acceptance via a real verify_cmd, a secret scrubber, cost accounting, command-injection gating." },
      m: [["142", { ru: "теста", en: "tests" }], ["83%", { ru: "покрытие", en: "coverage" }]],
      s: ["Python", "multi-model", "concurrency"],
    },
    {
      slug: "zapoy", cat: ["ai", "ml", "ops"], tag: "ai",
      ru: { t: "Запой — локальный ассистент", d: "llama.cpp, Qdrant, STT/TTS в профилях compose. Опасные инструменты — только после подтверждения человеком, red-team на косвенный prompt injection." },
      en: { t: "Zapoy — local assistant", d: "llama.cpp, Qdrant, STT/TTS in compose profiles. Risky tools require human approval; red-team runs against indirect prompt injection." },
      m: [["170+", { ru: "тестов", en: "tests" }]],
      s: ["llama.cpp", "Qdrant", "FastAPI", "MQTT", "Compose profiles"],
    },
    {
      slug: "smeta-ai-kz", cat: ["ai"], tag: "ai",
      ru: { t: "smeta-ai-kz", d: "AI-проверка строительных смет (кейс акселератора). LLM отвечает только за семантику, цифры и сверку с нормативами считает детерминированный код." },
      en: { t: "smeta-ai-kz", d: "AI review of construction estimates (accelerator case). The LLM handles semantics only; numbers and checks against the rate database are deterministic code." },
      m: [["10", { ru: "дней на MVP", en: "days to MVP" }], ["66", { ru: "тестов", en: "tests" }]],
      s: ["Claude API", "rapidfuzz", "SQLite", "Streamlit"],
    },
    {
      slug: "aikimat", cat: ["ai", "design"], tag: "ai",
      ru: { t: "AIkimat / RelayGov", d: "On-premise ассистент для органа власти: LangGraph с обязательным согласованием человеком, аудит, методика расчёта GPU под продакшен." },
      en: { t: "AIkimat / RelayGov", d: "On-prem assistant for a local government office: LangGraph with mandatory human approval, an audit trail, and a GPU capacity-planning method for production." },
      m: [["76", { ru: "тестов", en: "tests" }], ["0", { ru: "интернета нужно", en: "internet needed" }]],
      s: ["FastAPI", "LangGraph", "React 19", "Protocols"],
    },
    {
      slug: "airgapped-design", cat: ["design"], tag: "design",
      ru: { t: "Air-gapped AI-контур", d: "Архитектура на Kubernetes + vLLM + KEDA для предприятия: расчёт, ТЗ, защита перед руководством. Руководство выбрало интегратора, и в кейсе это сказано прямо." },
      en: { t: "Air-gapped AI platform", d: "Kubernetes + vLLM + KEDA architecture for an enterprise: sizing, spec, and a defence in front of leadership. They chose an integrator instead, and the case study says so up front." },
      m: [[{ ru: "проект", en: "design" }, { ru: "без внедрения", en: "not deployed" }]],
      s: ["Kubernetes", "GPU Operator", "vLLM", "KEDA", "Harbor"],
    },
    {
      slug: "manga-shorts", cat: ["ml", "ai"], tag: "ml",
      ru: { t: "manga-shorts", d: "Аниме-шортсы: vision-модель по сеткам превью (~8K токенов на главу), таймлайн по пословным таймкодам, голос — дообученная модель RVC." },
      en: { t: "manga-shorts", d: "Anime shorts: a vision model over thumbnail grids (~8K tokens per chapter), a timeline from word timestamps, narration by a fine-tuned RVC voice model." },
      m: [["~8K", { ru: "токенов / глава", en: "tokens / chapter" }], ["59", { ru: "эпох RVC", en: "RVC epochs" }]],
      s: ["vision LLM", "whisper", "RVC", "ffmpeg"],
    },
    {
      slug: "dofamin-shop", cat: ["app"], tag: "app",
      ru: { t: "Dofamin Shop", d: "Android-приложение (Next.js + Capacitor): парсер семи маркетплейсов прямо на устройстве, без своего бэкенда." },
      en: { t: "Dofamin Shop", d: "Android app (Next.js + Capacitor) with an on-device parser for seven marketplaces and no backend of its own." },
      m: [["~750", { ru: "тестов", en: "tests" }]],
      s: ["Next.js 16", "Capacitor 8", "Vitest"],
    },
    {
      slug: "vtube-acmt", cat: ["ml", "ai"], tag: "ml",
      ru: { t: "Vtube ACMT", d: "Генеративные модели для авто-рига VTuber: 3D по одной картинке (StdGEN), нарезка слоёв на NF4, авториг по 3D-голове, замеры времени и памяти на GPU, отрицательные результаты с IoU." },
      en: { t: "Vtube ACMT", d: "Generative models for VTuber auto-rigging: 3D from a single image (StdGEN), NF4 layer slicing, an auto-rig from a 3D head, GPU time and memory benchmarks, negative results with IoU." },
      m: [[{ ru: "12,6 мин", en: "12.6 min" }, { ru: "нарезка на 3060 (эталон 30)", en: "slicing on a 3060 (ref. 30)" }], [{ ru: "~11 мин", en: "~11 min" }, { ru: "3D на персонажа", en: "3D per character" }]],
      s: ["PyTorch", "StdGEN", "SAM", "Docker", "Prefect"],
    },
    {
      slug: "shakedown", cat: ["app"], tag: "app",
      ru: { t: "Shakedown", d: "Рогалик на Godot в духе FTL: 16 фаз по спецификациям, проходим целиком, баги движка найдены тестами." },
      en: { t: "Shakedown", d: "An FTL-style roguelike in Godot: 16 spec-driven phases, fully playable, engine bugs caught by tests." },
      m: [["650+", { ru: "тестов", en: "tests" }]],
      s: ["Godot 4.7", "GDScript", "GdUnit4"],
    },
  ];

  const POSTMORTEMS = [
    {
      ru: { t: "Три «тихие» смерти сервера за неделю", s: "Журнал обрывается на полуслове: ни паники, ни MCE, ни OOM.", c: "Просадки электричества. Нашлось по журналу питания ноутбука: 92 переключения на батарею за двое суток, два совпали с гибелью сервера до секунды.", f: "Last State в BIOS, правило «сначала журнал питания», ИБП в плане." },
      en: { t: "Three silent server deaths in a week", s: "The journal stops mid-line: no panic, no MCE, no OOM.", c: "Power sags in the flat. Found via the laptop's power log: 92 switches to battery in two days, two matching the server deaths to the second.", f: "Last State in BIOS, a “check the power log first” rule, a UPS on the list." },
    },
    {
      ru: { t: "Деплой, который перезапускал сам себя вечно", s: "Сборка убивается по таймауту, откатывается и начинается заново — каждый час.", c: "После docker builder prune слой torch+CUDA (~4 ГБ) качался заново на медленном канале дольше часового таймаута.", f: "pip cache mount в Dockerfile, таймаут 4 ч по худшему наблюдённому холодному билду." },
      en: { t: "A deploy that restarted itself forever", s: "The build is killed on timeout, rolled back and started again — every hour.", c: "After docker builder prune the torch+CUDA layer (~4 GB) re-downloaded over a slow link for longer than the one-hour timeout.", f: "pip cache mount in the Dockerfile; a 4 h timeout set from the worst cold build actually observed." },
    },
    {
      ru: { t: "Чистка облака удаляла файлы, но не строки", s: "126 записей в базе ссылались на удалённые клипы.", c: "Парсер ждал <id>.mp4, а реальные имена — \"<заголовок> (<id>).mp4\". Тестовая фикстура ошибалась так же, как код, поэтому тест был зелёным.", f: "Фикс парсера, сверка только по полному листингу: 126 → 65, ровно по числу живых файлов." },
      en: { t: "Cloud cleanup deleted files but not rows", s: "126 database rows pointed at deleted clips.", c: "The parser expected <id>.mp4; real names were \"<title> (<id>).mp4\". The test fixture was wrong the same way as the code, so the test stayed green.", f: "Parser fix plus reconciliation only on a full listing: 126 → 65, exactly the live files." },
    },
    {
      ru: { t: "Харнесс нашёл баг, которого не было", s: "Оценка отбора моментов показала дубликаты кандидатов.", c: "Харнесс пропускал шаг drop_overlapping, который есть в проде, то есть проверял упрощённую копию кода.", f: "Правило: харнесс повторяет прод шаг в шаг и импортирует функции пайплайна, а не копирует их." },
      en: { t: "The harness found a bug that wasn't there", s: "The moment-selection eval reported duplicate candidates.", c: "The harness skipped the drop_overlapping step that prod runs, so it was testing a simplified copy of the code.", f: "Rule: the harness mirrors prod step by step and imports pipeline functions instead of copying them." },
    },
  ];

  const TIERS = [
    { cls: "t1", color: "#22c55e", ru: ["Эксплуатирую сам", "в продакшене, с инцидентами"], en: ["Run in production", "with incidents to show"],
      items: ["Linux / Ubuntu Server", "systemd", "Bash", "Docker / Compose", "NVIDIA CTK (CDI)", "CUDA / NVENC", "Ansible", "GitHub Actions", "ufw / iptables", "Samba", "Tailscale", "SQLite", "Python", "FastAPI", "faster-whisper", "pyannote", "ffmpeg", "LangGraph", "LLM APIs", "model bake-offs", "eval harness", "llama.cpp + GBNF", "BGE-M3", "Qdrant hybrid (RRF)", "RVC fine-tuning"] },
    { cls: "t2", color: "#f59e0b", ru: ["Проектировал", "архитектура и расчёт, без эксплуатации"], en: ["Designed", "architecture and sizing, not operated"],
      items: ["Kubernetes + GPU Operator", "vLLM", "KEDA", "Harbor", "Qdrant cluster", "Redis Streams", "RabbitMQ / Celery", "LLM fine-tuning on own dataset"] },
    { cls: "t3", color: "#64748b", ru: ["Изучаю сейчас", "по плану, с практикой на своём железе"], en: ["Learning now", "on a plan, hands-on with my own hardware"],
      items: ["Kubernetes (minikube)", "Terraform", "Prometheus / Grafana / Loki", "vLLM self-hosted", "Argo CD"] },
  ];

  /* ---------------- helpers ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pick = (v, lang) => (v && typeof v === "object" ? v[lang] : v);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  const GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>';

  let lang = "ru";
  let filter = "all";
  const ruCache = {};
  const t = (k) => (lang === "en" ? EN[k] : RU[k] ?? ruCache[k]) ?? k;

  /* ---------------- renderers ---------------- */
  function renderFilters() {
    $("#filters").innerHTML = FILTERS.map((f) =>
      `<button type="button" class="chip" data-f="${f.id}" aria-pressed="${f.id === filter}">${esc(f[lang])}</button>`).join("");
  }

  function renderProjects() {
    $("#grid").innerHTML = PROJECTS.map((p) => {
      const L = p[lang];
      const shown = filter === "all" || p.cat.includes(filter);
      const tagLabel = FILTERS.find((f) => f.id === p.tag)[lang];
      const metrics = p.m.map(([a, b]) => `<li><b>${esc(pick(a, lang))}</b> ${esc(pick(b, lang))}</li>`).join("");
      const vis = p.pub ? `${GLOBE}${t("public")}` : `${LOCK}${t("private")}`;
      return `<article class="proj${p.featured ? " featured" : ""}"${shown ? "" : " hidden"}>
        <div class="proj-top"><span class="tag ${p.tag}">${esc(tagLabel)}</span><span class="vis">${vis}</span></div>
        <h3>${esc(L.t)}</h3>
        <p>${esc(L.d)}</p>
        <ul class="metrics">${metrics}</ul>
        <div class="stack">${p.s.map((x) => `<span>${esc(x)}</span>`).join("")}</div>
        <a class="proj-link" href="${caseUrl(p.slug, lang)}">${t("open")} ${ARROW}</a>
      </article>`;
    }).join("");
  }

  function renderPostmortems() {
    const lbl = lang === "en" ? ["Symptom", "Cause", "Fix"] : ["Симптом", "Причина", "Фикс"];
    $("#pm").innerHTML = POSTMORTEMS.map((p) => {
      const L = p[lang];
      return `<article class="card reveal in"><h3>${esc(L.t)}</h3><dl>
        <div class="pm-row s"><dt>${lbl[0]}</dt><dd>${esc(L.s)}</dd></div>
        <div class="pm-row c"><dt>${lbl[1]}</dt><dd>${esc(L.c)}</dd></div>
        <div class="pm-row f"><dt>${lbl[2]}</dt><dd>${esc(L.f)}</dd></div></dl></article>`;
    }).join("");
  }

  function renderTiers() {
    $("#tiers").innerHTML = TIERS.map((tr) => {
      const [h, sm] = tr[lang];
      return `<div class="card tier ${tr.cls} reveal in"><h3><i style="background:${tr.color}"></i><span>${esc(h)}<small>${esc(sm)}</small></span></h3>
        <div class="pills">${tr.items.map((x) => `<span>${esc(x)}</span>`).join("")}</div></div>`;
    }).join("");
  }

  function applyLang(next) {
    lang = next;
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => {
      const k = el.dataset.i18n;
      const v = t(k);
      if (v !== k) el.innerHTML = lang === "en" ? v : ruCache[k];
    });
    $$("[data-i18n-aria]").forEach((el) => {
      const k = el.dataset.i18nAria;
      el.setAttribute("aria-label", lang === "en" ? EN[k] : ruCache["aria:" + k]);
    });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $$("[data-case]").forEach((a) => { a.href = caseUrl(a.dataset.case, lang); });
    document.title = lang === "en" ? "Georgy Tolkachev — DevOps / MLOps" : "Георгий Толкачёв — DevOps / MLOps";
    renderFilters(); renderProjects(); renderPostmortems(); renderTiers();
    try { localStorage.setItem("lang", lang); } catch (_) { /* storage unavailable */ }
  }

  /* ---------------- terminal ---------------- */
  const LOG = [
    ["t-p", "$ ", "t-c", "systemctl start shortmaker-deploy"],
    ["t-d", "deploy: a41f0c2 -> 9be27d1"],
    ["t-d", "queue: 0 busy jobs, safe to proceed"],
    ["t-b", "build: worker bot ", "t-ok", "done 2m14s"],
    ["t-d", "health: poll 1/2 ", "t-ok", "worker ✓ bot ✓"],
    ["t-d", "health: poll 2/2 ", "t-w", "worker ✗ (crash loop)"],
    ["t-w", "deploy: 9be27d1 did not come up, rolling back"],
    ["t-d", "checkout a41f0c2 · build · health ", "t-ok", "✓"],
    ["t-v", "telegram: ↩️ rolled back to a41f0c2, service is up"],
    [""],
    ["t-p", "$ ", "t-c", "nvidia-smi --query-gpu=index,utilization.gpu --format=csv"],
    ["t-d", "0, 87 %   ", "t-ok", "← whisper large-v3 (paid queue)"],
    ["t-d", "1, 64 %   ", "t-b", "← nvenc render (claim: shorts)"],
  ];

  function runTerminal() {
    const el = $("#term");
    const lines = LOG.map((parts) => {
      let html = "";
      for (let i = 0; i < parts.length; i += 2) html += parts[i + 1] ? `<span class="${parts[i]}">${esc(parts[i + 1])}</span>` : "";
      return html;
    });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.innerHTML = lines.join("\n"); return; }
    let i = 0;
    const tick = () => {
      el.innerHTML = lines.slice(0, i).join("\n") + (i < lines.length ? "\n" : " ") + '<span class="caret"></span>';
      if (i++ < lines.length) setTimeout(tick, i === 1 ? 500 : 380 + Math.random() * 260);
    };
    tick();
  }

  /* ---------------- counters & reveal ---------------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    items.forEach((e) => io.observe(e));
  }

  function initCounters() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fmt = (n) => n.toLocaleString(lang === "en" ? "en-US" : "ru-RU");
    $$("[data-count]").forEach((el) => {
      const end = +el.dataset.count, suf = el.dataset.suffix || "";
      if (reduce) { el.textContent = fmt(end) + suf; return; }
      const start = performance.now(), dur = 1200;
      const step = (now) => {
        const k = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = fmt(Math.round(end * e)) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------------- boot ---------------- */
  $$("[data-i18n]").forEach((el) => { ruCache[el.dataset.i18n] = el.innerHTML; });
  $$("[data-i18n-aria]").forEach((el) => { ruCache["aria:" + el.dataset.i18nAria] = el.getAttribute("aria-label"); });

  document.addEventListener("click", (e) => {
    const lb = e.target.closest(".lang button");
    if (lb && lb.dataset.lang !== lang) applyLang(lb.dataset.lang);
    const chip = e.target.closest(".chip");
    if (chip) { filter = chip.dataset.f; renderFilters(); renderProjects(); }
  });

  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (_) { /* storage unavailable */ }
  const initial = saved || (/^ru|^uk|^be|^kk/i.test(navigator.language || "") ? "ru" : "en");
  applyLang(initial === "en" ? "en" : "ru");
  runTerminal();
  initReveal();
  initCounters();
})();
