#!/bin/bash
set -e

echo "Building..."
cargo build --release -p zkvm-cli > /dev/null 2>&1

echo "Running benchmarks..."
echo ""
echo "=== Execution ==="
time ./target/release/zkvm run examples/branching.zkasm > /dev/null

echo ""
echo "=== Proving ==="
time ./target/release/zkvm prove examples/branching.zkasm /tmp/branching.proof > /dev/null

echo ""
echo "=== Verification ==="
time ./target/release/zkvm verify examples/branching.zkasm /tmp/branching.proof > /dev/null
