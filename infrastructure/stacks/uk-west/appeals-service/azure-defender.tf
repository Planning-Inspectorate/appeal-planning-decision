resource "azurerm_advanced_threat_protection" "appeal_documents" {
  target_resource_id = azurerm_storage_account.appeal_documents.id
  enabled            = true
}
