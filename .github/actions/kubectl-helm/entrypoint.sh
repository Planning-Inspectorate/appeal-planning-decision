#!/bin/sh
result="$(bash -c "$1")"

status=$?
echo ::set-output name=result::$result
echo "$result"
if [[ $status -eq 0 ]]; then exit 0; else exit 1; fi
