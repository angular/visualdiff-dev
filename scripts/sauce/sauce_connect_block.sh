#!/bin/bash

# Wait for Connect to be ready before exiting
printf "Connecting to Sauce.\n"
while [ ! -f $SAUCE_READYFILE ]; do
  printf "."
  sleep .5
done
printf "\nConnected"
