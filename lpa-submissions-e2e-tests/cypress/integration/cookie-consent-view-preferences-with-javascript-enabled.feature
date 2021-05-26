Feature: Cookie Consent - View Preferences with JavaScript enabled

  As a PO for the LPA Questionnaire
  I want the service users to be able to view their cookie preferences
  So that the service adheres to the latest cookie legislation

  Scenario: Cookie information
    Given a user has elected to manage their cookie preference
    When the user views the Cookie Preferences service
    Then the user is provided information of what task each cookie is performing
