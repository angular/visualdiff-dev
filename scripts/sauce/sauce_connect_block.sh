#!/bin/bash

# Wait for Connect to be ready before exiting
printf "Connecting to Sauce."
while [ ! -f $BROWSER_PROVIDER_READY_FILE ]; do
  printf "."
done
echo "Connected"
