k8s_min_nodes = 3
k8s_max_nodes = 5
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
  }]
}]
redis_capacity = 2
redis_family = "C"
redis_sku = "Basic"
