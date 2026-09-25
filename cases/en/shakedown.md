# Shakedown — a Godot roguelike built in phases with tests

> An FTL-style roguelike: build a ship from a hull, bulkheads and modules, fight in real time with
> pause, and cross sectors up to the final boss. Outside my main specialization, but built with the
> same engineering practices: specifications, phases, tests, headless CI runs.

**Role:** author · **Status:** v1–v3 done, the game is fully playable from the Play button
**Stack:** Godot 4.7 · GDScript · GdUnit4
**Numbers:** 180+ commits · 16 phases · 75 plans · 650+ tests
**Code:** private

---

The game loop: menu → ship builder (build phases, module palette) → sector map → combat / station /
event → victory over the boss or defeat → menu. The end-to-end run state lives in a single autoloaded
`RunState`.

## Engine pitfalls caught by tests

- `@export` on a class derived from `RefCounted` breaks member resolution.
- GdUnit4's `scene_runner` delivers input twice.
- GDScript lambdas capture local `int`/`float` by value: a counter inside a lambda does not change the
  outer variable.
- Addon autoloads registered via `uid://` do not resolve in a pure-CLI headless run, so they use
  direct `res://` paths.
