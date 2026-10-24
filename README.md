# rust-stark-zkvm

www.zkvm.host  STARK-Verifiable Virtual Machine for Provable Computation
<img width="1983" height="793" alt="banner" src="https://github.com/user-attachments/assets/ebc8ee07-ed22-410a-b7ed-cb57967f8a0e" />

[![ZK proof CI gate](https://github.com/CodesbyFebin/rust-stark-zkvm/actions/workflows/zk-ci.yml/badge.svg)](https://github.com/CodesbyFebin/rust-stark-zkvm/actions/workflows/zk-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A small, real zero-knowledge virtual machine: an interpreter, a STARK arithmetization
(AIR), and a prover/verifier built on [Winterfell](https://github.com/facebook/winterfell).
It executes `ADD`/`SUB`/`MUL` programs with real conditional control flow (`JZ`/`JNZ`)
and a small fixed register file (`LOAD`/`STORE`), and produces a STARK proof that a
specific program — including which branch it took and which register it touched — was
executed correctly.

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for what this does and — just as importantly —
does not cover yet, and how it relates to the larger multi-phase strategy it grew out of.

![Architecture](docs/assets/architecture.svg)

## Target Metrics

For the 2030 Hackathon version, we demonstrate:
- **Proving Speed**: Sub-second proof generation for small computations.
- **Proof Size**: Compact proofs around 15KB-50KB depending on trace length.
- **AI-Agent-Native Integration**: `zkvm-host-server` provides a Model Context Protocol (MCP) server integration, allowing AI agents like Claude Desktop or Cursor to construct requests, deploy codes, and interact with proving APIs naturally.

## Architecture Highlights
- `crates/zkvm-isa`: Custom `.zkasm` interpreter and control flow logic.
- `crates/zkvm-stark`: The `VmAir` algebra binding executions to commitments.
- `crates/zkvm-cli`: Developer toolchain (`run`, `prove`, `verify`, `deploy`, `demo`).
- `crates/zkvm-host-server`: Proving-as-a-service over HTTP and MCP.

## Quick start

```bash
cargo build --release
cargo test --release --workspace

# run the full execute -> prove -> verify -> tamper-check demo
cargo run --release -p zkvm-cli -- demo

# Benchmark script:
./scripts/bench.sh
```
