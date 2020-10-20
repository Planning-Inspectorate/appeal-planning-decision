resource "github_actions_secret" "docker_password" {
  plaintext_value = azurerm_container_registry.containers.admin_password
  repository = var.github_repo_name
  secret_name = "DOCKER_PASSWORD"
}

resource "github_actions_secret" "docker_registry" {
  plaintext_value = azurerm_container_registry.containers.login_server
  repository = var.github_repo_name
  secret_name = "DOCKER_REGISTRY"
}

resource "github_actions_secret" "docker_username" {
  plaintext_value = azurerm_container_registry.containers.admin_username
  repository = var.github_repo_name
  secret_name = "DOCKER_USERNAME"
}
