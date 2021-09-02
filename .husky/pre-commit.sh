#!/usr/bin/env bash

PACKAGES_DIR="${1}"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )/.."

for pkg in "${DIR}"/"${PACKAGES_DIR}"/*
do
  cd "${pkg}" || exit 1
 "${DIR}/node_modules/.bin/lint-staged" || true
done
