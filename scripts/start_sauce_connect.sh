#!/usr/bin/env bash

SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`
npm run sauce-connect