location = "ukwest"
target_subscription_id = "cbd9712b-34c8-4c94-9633-37ffc0f54f9d"
pins_key_vault_subscription_id = "cbd9712b-34c8-4c94-9633-37ffc0f54f9d"
pins_key_vault = "/subscriptions/cbd9712b-34c8-4c94-9633-37ffc0f54f9d/resourceGroups/ODT-KEY-VAULT/providers/Microsoft.KeyVault/vaults/odtkeyvault"

horizon_enabled = false

k8s_min_nodes = 3
k8s_max_nodes = 5

mongodb_auto_failover = true
mongodb_databases = []
mongodb_failover_locations = []
mongodb_multi_write_locations = true

network_create_own = false
network_subnet = ["10.224.161.96/27"]
