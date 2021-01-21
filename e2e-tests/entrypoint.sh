#!/usr/bin/env bash

set -e

echo "Create large test files"
npm run test:e2e:files

echo "Running e2e tests"
npm run test:e2e
