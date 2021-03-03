pins_key_vault_subscription_id = "cbd9712b-34c8-4c94-9633-37ffc0f54f9d"
pins_key_vault = "/subscriptions/cbd9712b-34c8-4c94-9633-37ffc0f54f9d/resourceGroups/ODT-KEY-VAULT/providers/Microsoft.KeyVault/vaults/odtkeyvault"

horizon_enabled = true
horizon_gateway_subnets_secret = "horizon-gateway-subnets-prod"
horizon_gateway_ip_secret = "horizon-gateway-ip-prod"
horizon_shared_key_secret = "horizon-gateway-shared-key-prod"
network_subnet_range = "10.30.0.0/16"

k8s_min_nodes = 3
k8s_max_nodes = 5

mongodb_auto_failover = true
mongodb_databases = []
mongodb_failover_locations = []
mongodb_multi_write_locations = true
