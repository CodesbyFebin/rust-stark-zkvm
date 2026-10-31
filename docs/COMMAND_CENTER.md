# Dragon Command Center

The static dashboard lives in [site/command-center](../site/command-center). It is a visual operator surface for the existing .zkasm proving API, not a sandbox executor or a source of synthetic proof results.

## Live API workflow

1. Start zkvm-host-server on loopback or behind an operator-managed reverse proxy.
2. Configure the dashboard's API base URL.
3. The dashboard checks GET /healthz and GET /v1/backends.
4. It enables proof generation only when the real stark backend is registered.
5. Generate a proof through POST /v1/proofs.
6. Independently verify the returned proof bytes against the exact current source through POST /v1/verify.
7. The UI reports VERIFIED only when the verifier returns valid: true. Editing the source clears the previous proof to prevent stale-source verification.

The browser computes a SHA-256 fingerprint of the returned proof bytes for display. That fingerprint is an artifact identifier, not a proof of execution or an attestation.

## CORS

For a dashboard hosted at https://www.zkvm.host, start the server with:

~~~bash
ZKVM_ALLOWED_ORIGINS=https://www.zkvm.host cargo run --release -p zkvm-host-server
~~~

The environment variable accepts a comma-separated allowlist. Invalid origin values are ignored. An unset or empty allowlist denies cross-origin browser access. The service still binds to loopback by default; use a TLS reverse proxy and an authenticated, trusted network if the API must be reachable remotely. CORS is a browser policy, not authentication.

## Clans and animation

The ten clan cards and 500 planned specialist slots are interface/catalog concepts only. They do not represent connected agents, installed security tools, Kubernetes pods, active scans, or measured activity. No target is contacted and no security tool is executed by selecting a clan.

The dragon artwork and CSS animation are presentation assets. The visual state can react to actual proof generation and verification responses, but the artwork itself is not a sensor, attestor, or cryptographic component.

## Current trust boundaries

- The only live compute action exposed here is the existing .zkasm STARK prove/verify API.
- The VM uses public program inputs and re-executes the program to derive verifier public inputs.
- The custom VM is not a Linux or general-purpose Rust execution environment.
- The on-chain contract path remains a trusted attester bridge, not a trustless on-chain STARK verifier.
- The service has no built-in user authentication, durable job queue, or multi-tenant authorization. Do not expose it as an unauthenticated public service.
