# Applications
#
# Infrastructure-specific configuration data for individual
# applications. This shouldn't have much stuff in there, but
# it will be useful for putting configuration data into
# Key Vault

resource "random_string" "fwa-session-key" {
  length = 32
  special = false
  upper = true
  lower = true
  number = true
}

resource "random_string" "lpa-questionnaire-session-key" {
  length = 32
  special = false
  upper = true
  lower = true
  number = true
}
