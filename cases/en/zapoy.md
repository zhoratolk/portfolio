# Zapoy — a local voice assistant: a modular monolith on Docker Compose

> An autonomous assistant with no cloud: a local LLM, speech recognition and synthesis, long-term
> memory, web search and a smart home. The core only knows an OpenAI-compatible URL, so any model can
> be swapped with one line in `.env`.

**Role:** author · **Status:** deployed on the home GPU server; the Android client is written but has not been built yet
**Stack:** FastAPI · llama.cpp server (CUDA, GGUF) · speaches / faster-whisper large-v3 · Piper TTS · Qdrant · SearXNG + trafilatura · MQTT (mosquitto) / Home Assistant · ntfy · Docker Compose profiles · Kotlin (Android)
**Numbers:** 170+ tests
**Code:** private

---

## Layers

| Layer | Now | How to replace |
|---|---|---|
| Brain | llama.cpp server (GGUF) | the `LLM_GGUF` line in `.env` |
| STT | speaches / faster-whisper large-v3 | `STT_MODEL` |
| TTS | Piper | path to the voice |
| Memory | Qdrant | — |
| Search | SearXNG + trafilatura | — |
| IoT | MQTT / Home Assistant | — |

```mermaid
flowchart LR
  mic([Voice / Android client]) <-->|WebSocket| gw[Gateway · FastAPI]
  gw -->|OpenAI API| llm[llama.cpp<br/>server-cuda]
  gw --> stt[STT: faster-whisper] & tts[TTS: Piper]
  gw --> mem[(Qdrant)] & emb[embed]
  gw --> tools{@tool tools<br/>pydantic schema + risk level}
  tools --> web[SearXNG] & iot[MQTT · Home Assistant] & sb[sandbox] & nt[ntfy]
  warden[gpu-warden] -.watches VRAM.- llm
  rt[redteam] -.attacks.-> gw
```

## Engineering decisions

- **Compose profiles** (`voice`, `web`, `iot`): only what is needed comes up. The base set is `llm`,
  `qdrant`, `gateway`.
- **Tools with a risk level:** an `@tool` decorator with a pydantic schema and `Risk.CONFIRM`. A risky
  call (for example, a command on the PC) is blocked until a human approves it: an ntfy push
  notification arrives with "Allow / Deny" buttons. Commands run in a separate `sandbox` container.
- **Red-team against indirect prompt injection:** poisoned pages are fed through the real
  `fetch_page` tool, and the SSE stream is checked for whether any locked tool executed after
  untrusted input. Verdicts: `BLOCKED` / `IGNORED` — pass, `LEAKED` / `EXECUTED` — fail.
- **A byte-stable prompt prefix:** everything dynamic goes strictly after the static part, otherwise
  llama.cpp's KV cache is invalidated and every answer is computed from scratch.
- **One protocol, two clients:** `gateway/app/voice/ws.py` is the source of truth, the Kotlin client
  mirrors the frames. On Android — RNNoise noise suppression (weights verified by sha256).

## Pitfalls

- In recent `llama.cpp` builds the `-fa` flag requires a value (`-fa on`), otherwise the server does
  not start.
- CDI ignores `NVIDIA_DRIVER_CAPABILITIES`, so cards are passed through with `device_ids`.
- Published Docker ports bypass the host's ufw. The fix is to bind ports to a specific address or to
  write rules into the `DOCKER-USER` chain.
