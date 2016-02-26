#!/usr/bin/env bash
set -ex

echo "=======  Starting build-and-test.sh  ========================================"

# Go to project dir
cd $(dirname $0)/../..

# Include sources.
source scripts/ci/tunnel.sh

# Start http server
npm run server &

# Setup environment.
start_tunnel
wait_for_tunnel
npm test
teardown_tunnel

