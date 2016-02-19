#!/usr/bin/env bash

start_tunnel() {
  ./scripts/sauce/sauce_connect_setup.sh
}

wait_for_tunnel() {
  ./scripts/sauce/sauce_connect_block.sh
  sleep 10
}

teardown_tunnel() {
  ./scripts/sauce/sauce_connect_teardown.sh
}

