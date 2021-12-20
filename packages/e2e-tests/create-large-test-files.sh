#!/usr/bin/env bash

if [[ -z "${FILE_UPLOAD_MAX_FILE_SIZE_BYTES}" ]]; then
  MAX_SIZE=15000000
else
  MAX_SIZE=$FILE_UPLOAD_MAX_FILE_SIZE_BYTES
fi
TOO_BIG=$((MAX_SIZE+1))
dd if=/dev/zero of=packages/e2e-tests/cypress/fixtures/appeal-statement-valid-max-size.png bs=$MAX_SIZE count=1
dd if=/dev/zero of=packages/e2e-tests/cypress/fixtures/appeal-statement-invalid-too-big.png bs=$TOO_BIG count=1
dd if=/dev/zero of=packages/e2e-tests/cypress/fixtures/upload-file-valid-max-size.png bs=$MAX_SIZE count=1
dd if=/dev/zero of=packages/e2e-tests/cypress/fixtures/upload-file-invalid-too-big.png bs=$TOO_BIG count=1
