Feature: Cookie consent bar - no JS

  As a PO on the LPA Questionnaire
  I need the cookie banner to cater for users who don’t have JS enabled
  So that the service is compliant with the GDS standards

  Scenario: Cookie banner always displays
    Given a user visits the site with JavaScript disabled
    When the user navigates through the service
    Then the cookie banner remains visible

  Scenario: Cookie banner links to cookie settings page
    Given a user visits the site with JavaScript disabled
    When the user views the cookie preferences page
    Then the cookies page is presented
    And the cookie banner does not exist
