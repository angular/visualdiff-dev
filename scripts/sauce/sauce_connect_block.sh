#!/bin/bash

# Wait for Connect to be ready before exiting
printf "Connecting to Sauce."
while [ ! -f $SAUCE_READYFILE ]; do
  printf "."
  sleep .5
done
echo "Connected"
