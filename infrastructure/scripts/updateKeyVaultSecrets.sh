#!/bin/bash

set -e

echo "Updating Key Vault secrets"

DECODED_KEY_VAULT_SECRETS=$(echo "${KEY_VAULT_SECRETS}" | base64 -d)

az account show

for key in $(echo "${DECODED_KEY_VAULT_SECRETS}" | jq -r 'keys[]')
do
  echo "Adding ${key}"

  value=$(echo "${DECODED_KEY_VAULT_SECRETS}" | jq -r --arg key "${key}" '.[$key]')

  # Recover the secret - allowed the fail
  echo "Attempting to recover secret"
  (az keyvault secret recover \
    --output none \
    --vault-name="${KEY_VAULT_NAME}" \
    --name="${key}" \
    && echo "Pausing whilst recovery takes place" \
    && sleep 5) || true

  # Create/update the secret
  echo "Setting the new secret value"
  az keyvault secret set \
    --output none \
    --vault-name="${KEY_VAULT_NAME}" \
    --name="${key}" \
    --value="${value}"
done
