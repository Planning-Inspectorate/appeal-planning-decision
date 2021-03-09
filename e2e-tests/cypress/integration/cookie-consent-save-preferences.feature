Feature: Cookie Consent - Save Preferences

  As a PO for the appeals service
  I want the service users to be able to view their cookie preferences
  So that the service adheres to the latest cookie legislation

  @as-1214 @as-1214-1
  Scenario: Initial cookie preference view
    Given a user has not previously submitted cookie preferences
    When a user is managing their cookie preference
    Then the not necessary cookies are shown as neither enabled or disabled
    And the cookie banner does not exist

  @as-1214 @as-1214-2
  Scenario: Manage Cookie preference - Disable
    Given a user is managing their cookie preference
    When the user disables a not necessary cookie
    Then the usage cookie is marked as inactive
    And any existing third party cookies have been deleted

  @as-1214 @as-1214-3
  Scenario: Manage Cookie preferences - Enable
    Given a user is managing their cookie preference
    When the user enables a not necessary cookie
    Then the not necessary cookie is active from that point onwards
