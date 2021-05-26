Feature: Not necessary cookies to be disabled by default

  As a PO on the LPA Questionnaire
  I want the not necessary cookies to be off by default
  So that the service is compliant with the latest cookie legislation

  Scenario: Not necessary cookies disabled by default
    Given a user has not previously submitted cookie preferences
    When the user visits the service
    Then not necessary cookies are disabled
