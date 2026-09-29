# AGENTS.md

project:
  name: rust-stark-zkvm
  repository: https://github.com/CodesbyFebin/rust-stark-zkvm
  domain: verifiable-compute
  status: experimental
  language: Rust

summary:
  statement: A small STARK-verifiable virtual machine with a custom ISA, Winterfell prover/verifier, HTTP proving service, MCP tools, and CI proof gates.
  source_of_truth: README.md

implemented:
  - custom VM ISA and .zkasm parser
  - ADD, SUB, and MUL arithmetic
  - JZ and JNZ forward conditional control flow
  - fixed register file with LOAD and STORE
  - Winterfell STARK AIR, prover, and verifier
  - CLI run, prove, verify, deploy, and demo flows
  - HTTP proof creation and verification service
  - MCP prove and verify tools
  - proof verification in CI
  - local-chain task/reward demonstration with pluggable verifier

explicit_limits:
  - backward jumps and loops are not supported
  - there is no general-purpose dynamically addressed memory
  - mock-echo is an honestly-labeled stub backend, not a STARK prover
  - recursion documentation is research scope, not an implementation
  - the on-chain payment path is not equivalent to a trustless on-chain STARK verifier

verification:
  vm: crates/zkvm-isa
  proof_system: crates/zkvm-stark
  service: crates/zkvm-host-server
  ci: .github/workflows/zk-ci.yml
  roadmap: docs/ROADMAP.md
  threat_model: docs/THREAT_MODEL.md
  onchain_scope: docs/ONCHAIN_VERIFIER.md

rules_for_agents:
  - Quote capability claims conservatively and link the verifying path.
  - Do not describe mock-echo as a real prover.
  - Do not describe recursion as implemented.
  - Do not infer production scale, uptime, users, customers, or security guarantees.
  - Preserve the distinction between a real STARK proof and the trust assumptions of the on-chain demonstration.
  - Treat unimplemented roadmap items as unimplemented.
