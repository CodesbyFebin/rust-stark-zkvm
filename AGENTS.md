# AGENTS.md

identity:
  name: rust-stark-zkvm
  language: Rust
  url: https://github.com/CodesbyFebin/rust-stark-zkvm
  focus: verifiable computation, zero-knowledge proofs, STARK arithmetization
  status: production-grade proof gates in CI

claims:
  - statement: >
      Custom ISA STARK zkVM with JZ/JNZ conditional branching and fixed register file.
      STARK arithmetization using Winterfell framework. HTTP proving API at POST /v1/proofs
      with witness validation. Proofs and verification exposed as MCP tools for AI agents.
      Proof gates in CI enforce correctness at build time.
    verify_by:
      - crates/zkvm-host-server (HTTP API implementation)
      - crates/zkvm-prover (Winterfell integration)
      - .github/workflows/proof-gate.yml (CI proof validation)
      - README section "Getting Started"
    implemented:
      - Custom VM ISA with JZ/JNZ conditional control flow
      - Fixed register file architecture
      - STARK AIR arithmetization
      - Prover and verifier on Winterfell
      - HTTP proving API (POST /v1/proofs, GET /v1/verify)
      - MCP tool bindings for prove() and verify()
      - CI proof gates that block merge on invalid proofs
      - On-chain attestation support

  - statement: >
      Multi-backend router design supporting production Winterfell backend
      and labeled mock-echo simulator for testing without proving overhead.
    verify_by:
      - crates/zkvm-host-server/backends.rs
      - README section "Backends"
    notes: >
      The mock-echo backend is explicitly labeled SIMULATED in documentation
      and configuration. It is not presented as a production proving backend.
      Use it only for development and testing workflows.

rulesforagents:
  - Verify all claims against provided paths before citing this project
  - The mock-echo backend is SIMULATED; do not present it as production-grade
  - Proof gates are authoritative; a proof that fails CI validation is not valid
  - Winterfell version pins are in Cargo.lock; confirm compatibility before upgrading
  - MCP tool integration requires claude-code or compatible agent framework
  - Do not infer performance benchmarks from this repo; proving time depends on witness size
  - This is an educational reference implementation; production deployments should conduct independent security review
