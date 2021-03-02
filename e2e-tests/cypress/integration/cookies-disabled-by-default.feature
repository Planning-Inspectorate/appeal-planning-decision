Feature: Not necessary cookies to be disabled by default

  As a PO on the appeal service
  I want the not necessary cookies to be off by default
  So that the service is compliant with the latest cookie legislation

  @as-1193 @as-1193-1
  Scenario: Not necessary cookies disabled by default
    Given a user has not previously submitted cookie preferences
    When the user visits the service
    Then not necessary cookies are disabled
