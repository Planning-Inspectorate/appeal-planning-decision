@wip @has
Feature: Page not found

  As a Service owner of the appeals service
  I need the service to adhere to the GDS design standards
  So that the service will pass the beta assessment

  @as-1198
  Scenario: The 404 page with GDS standards
    Given an appeal is being made
    When an unknown url is requested
    Then the error page will be displayed
