# Benchmarks

Standardized benchmarks for `rust-stark-zkvm`.
To reproduce these benchmarks, run `./scripts/bench.sh`.

## Workloads

Currently tested workloads include branching paths and arithmetic examples (e.g., `examples/branching.zkasm`).

| Program | Trace Length | Proving Time (STARK) | Verification Time (STARK) |
| --- | --- | --- | --- |
| `branching.zkasm` | 8 rows | < 10ms | < 5ms |

*Numbers represent local runs on standard x86 consumer hardware.*
