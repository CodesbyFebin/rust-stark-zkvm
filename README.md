# rust-stark-zkvm

**A compact Rust virtual machine with real Winterfell STARK proving and independent verification.**

[![ZK proof CI gate](https://github.com/CodesbyFebin/rust-stark-zkvm/actions/workflows/zk-ci.yml/badge.svg)](https://github.com/CodesbyFebin/rust-stark-zkvm/actions/workflows/zk-ci.yml)
[![Dashboard CI](https://github.com/CodesbyFebin/rust-stark-zkvm/actions/workflows/dashboard-ci.yml/badge.svg)](https://github.com/CodesbyFebin/rust-stark-zkvm/actions/workflows/dashboard-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This repository implements a deliberately small .zkasm machine, its Winterfell AIR, a STARK prover/verifier, a Rust CLI, an HTTP proving service, MCP tools, and an explicitly scoped on-chain attestation example.

It is a **public-input verifiable-computation research implementation**. It is not a general-purpose Rust/Linux zkVM, does not hide program inputs, and is not independently audited. Read the threat model and roadmap before relying on it.

## What is implemented

- **ISA and interpreter** — INIT, ADD, SUB, MUL, forward-only JZ/JNZ, and LOAD/STORE over four fixed registers.
- **Winterfell STARK** — a custom AIR binds the proof to the public program, its executed/skipped instruction rows, the result, and register transitions.
- **Independent verification** — the verifier derives public inputs from the supplied program and verifies the proof. It enforces a minimum **95-bit conjectured-security policy** rather than accepting whatever proof parameters the untrusted proof requests.
- **CLI** — run, prove, verify, deploy, and demo.
- **HTTP service** — real stark proving and verification endpoints plus an honestly labeled mock-echo routing stub. The stub is not cryptographic and always refuses verification.
- **MCP tools** — prove and verify for compatible MCP clients.
- **CI proof gate** — workspace tests and real example prove/verify round trips.
- **Foundry contracts** — a task/reward orchestrator with an explicitly trusted off-chain attester bridge. It is not an on-chain STARK verifier.

## What this does not prove

- It does not prove arbitrary Rust, ELF, Linux, Kali Linux, container, or Kubernetes execution.
- It does not provide private-witness zero knowledge: the program and inputs are public, and the verifier re-executes the program to derive the expected public inputs.
- The ISA has no backward jumps/loops, dynamic RAM, or RISC-V compatibility.
- The current on-chain attestation path trusts a designated attester key. It does not verify Winterfell STARK proofs inside the EVM.
- Passing CI is regression evidence, not a formal proof of soundness, an external audit, or production certification.

See [the roadmap](docs/ROADMAP.md), [threat model](docs/THREAT_MODEL.md), and [on-chain verifier scope](docs/ONCHAIN_VERIFIER.md) for the detailed boundaries.

## Quick start

Requires a current stable Rust toolchain.

~~~bash
cargo build --release --workspace
cargo test --release --workspace

# Execute, prove, verify, and run tamper checks.
cargo run --release -p zkvm-cli -- demo

# Run an example.
cargo run --release -p zkvm-cli -- run examples/branching.zkasm

# Generate and independently verify a proof.
cargo run --release -p zkvm-cli -- prove examples/fibonacci_like.zkasm out.proof
cargo run --release -p zkvm-cli -- verify examples/fibonacci_like.zkasm out.proof
~~~

The release-mode test requirement is documented in the AIR implementation: Winterfell's debug-only transition-degree self-check is stricter than the degree upper-bound rule used by the verifier for this data-dependent constraint. Do not interpret release-mode success as an audit or as a substitute for reviewing the constraint system.

## HTTP proving service

Start the service on loopback:

~~~bash
cargo run --release -p zkvm-host-server
~~~

The HTTP listener defaults to 127.0.0.1:4477; the MCP listener uses 127.0.0.1:4478.

| Route | Method | Purpose |
| --- | --- | --- |
| /healthz | GET | Process health |
| /v1/backends | GET | Registered backend names |
| /v1/proofs | POST | Generate a real STARK proof from a .zkasm program |
| /v1/verify | POST | Verify proof_base64 against the supplied .zkasm program |
| /v1/backends/{name}/proofs | POST | Generate through a named backend |
| /v1/backends/{name}/verify | POST | Verify through a named backend |

Proof responses include Winterfell's conjectured-security estimate and the verifier's minimum policy. A generated proof is not an accepted proof until the independent verification route returns valid: true.

### Browser dashboard CORS

The [Dragon Command Center](/command-center/) is a static browser client for the real HTTP API. For a dashboard served from another origin, explicitly allowlist that exact origin:

~~~bash
ZKVM_ALLOWED_ORIGINS=https://www.zkvm.host cargo run --release -p zkvm-host-server
~~~

Multiple origins can be comma-separated. With the variable unset, cross-origin browser access is denied. Do not use a wildcard for a proving service. Put remote deployments behind TLS, authentication, network controls, and an operator-managed reverse proxy; the current service is intended for local or trusted-network use, not as an unauthenticated public proving endpoint.

## Repository layout

- crates/zkvm-isa — parser, instruction set, interpreter, execution trace.
- crates/zkvm-stark — AIR, Winterfell prover, verifier, proof security policy.
- crates/zkvm-cli — command-line interface.
- crates/zkvm-host-server — HTTP API, backend router, MCP server.
- contracts/ — Foundry orchestrator and attester bridge.
- examples/ — small .zkasm programs.
- homepage-next/ — documentation and project website source.
- site/command-center/ — responsive dragon-themed dashboard; proof actions call the configured API.
- docs/ — roadmap, architecture, threat model, service and verifier scope.

## Security policy

This project is experimental and unaudited. Report suspected soundness or security issues privately using the process in SECURITY.md. Do not send secrets, credentials, or private target data in public issues.

## License

MIT. See LICENSE.
