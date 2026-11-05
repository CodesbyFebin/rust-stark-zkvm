# Repository engineering guidance

identity:
  name: rust-stark-zkvm
  language: Rust
  url: https://github.com/CodesbyFebin/rust-stark-zkvm
  focus: public-input verifiable computation, STARK arithmetization, Winterfell
  status: research implementation with CI regression gates

claims:
  - statement: >
      Custom .zkasm ISA with arithmetic, forward-only conditional branches,
      and four fixed registers; Winterfell STARK prover and verifier; HTTP
      proving API and MCP tools; Foundry attestation example.
    verify_by:
      - crates/zkvm-isa/src/lib.rs
      - crates/zkvm-stark/src/lib.rs
      - crates/zkvm-host-server/src/lib.rs
      - crates/zkvm-host-server/src/mcp.rs
      - contracts/src
      - .github/workflows/zk-ci.yml
    implemented:
      - Custom .zkasm parser and interpreter
      - Winterfell AIR, prover, and verifier
      - Verifier minimum conjectured-security policy
      - HTTP POST /v1/proofs and POST /v1/verify
      - MCP prove and verify tools
      - CI tests and real example prove/verify round trips
      - Trusted off-chain attestation bridge example
    not_implemented:
      - General-purpose Rust, ELF, Linux, or Kali execution
      - Private-witness zero knowledge
      - Backward jumps, loops, dynamic RAM, or RV32I
      - Trustless on-chain STARK verification
      - External audit or formal soundness proof

  - statement: >
      The backend router registers one real Winterfell backend and one
      non-cryptographic mock-echo routing stub.
    verify_by:
      - crates/zkvm-host-server/src/backends/stark.rs
      - crates/zkvm-host-server/src/backends/mock_echo.rs
      - crates/zkvm-host-server/src/router.rs
    notes: >
      mock-echo is not a prover. Its verify method must continue to fail
      closed and must never return a successful verification result.

rules_for_agents:
  - Verify claims against current source and tests before documenting them.
  - Never label the public-input model as private-witness zero knowledge.
  - Never describe this custom ISA as executing arbitrary Rust, Linux, Kali, or Kubernetes workloads.
  - The verifier must enforce a verifier-owned security policy; never derive acceptable proof parameters from the submitted proof.
  - mock-echo is simulated/non-cryptographic and must never report a valid proof.
  - The Solidity attester bridge is trusted; it is not an on-chain STARK verifier.
  - Do not invent performance benchmarks, worker counts, audit status, or production readiness.
  - Keep dashboard demo states visibly separate from live API responses.
  - Run cargo test --release --workspace and the dashboard CI checks after relevant changes.
