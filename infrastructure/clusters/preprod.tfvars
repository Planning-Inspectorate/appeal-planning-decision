pins_key_vault_subscription_id = "cbd9712b-34c8-4c94-9633-37ffc0f54f9d"
pins_key_vault = "/subscriptions/cbd9712b-34c8-4c94-9633-37ffc0f54f9d/resourceGroups/ODT-KEY-VAULT/providers/Microsoft.KeyVault/vaults/odtkeyvault"

documents_allow_team_access = true

horizon_enabled = true
horizon_gateway_subnets_secret = "horizon-gateway-subnets-preprod"
horizon_gateway_ip_secret = "horizon-gateway-ip-preprod"
horizon_shared_key_secret = "horizon-gateway-shared-key-preprod"
network_subnet_range = "10.31.0.0/16"

k8s_min_nodes = 3
k8s_max_nodes = 5

mongodb_allow_team_data_access = true
mongodb_auto_failover = false
mongodb_databases = []
mongodb_failover_locations = []
mongodb_multi_write_locations = false
