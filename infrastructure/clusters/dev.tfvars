k8s_min_nodes = 3
k8s_max_nodes = 5

mongodb_auto_failover = false
mongodb_databases = [{
  name = "appeals"
  collections = [{
    name = "appeals"
    default_ttl_seconds = 0
    indexes = []
  }]
}, {
  name = "documents"
  collections = [{
    name = "documents"
    default_ttl_seconds = 0
    indexes = []
  }],
  name = "sessions"
  collections = [{
    name = "sessions"
    default_ttl_seconds = 0
    indexes = []
  }]
}]
mongodb_failover_locations = []
mongodb_multi_write_locations = false
mongodb_zone_redundancy = false
