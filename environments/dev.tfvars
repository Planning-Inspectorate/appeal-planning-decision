k8s_min_nodes = 3
k8s_max_nodes = 5
mongodb_databases = [{
  name = "appeals"
  collections = [{
    name = "appeals"
    default_ttl_seconds = 0
    indexes = []
  }]
}]
