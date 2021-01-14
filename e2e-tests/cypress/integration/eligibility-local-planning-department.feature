@smoketest
Feature: A prospective appellant supplies a Local Planning Department for the case they wish to appeal
    Not every LPA is taking part in this iteration of the service.

  Scenario: Local Planning Department is required
    Given the list of Local Planning Department is presented
    When the user does not provide a Local Planning Department
    Then the user is informed that a Local Planning Department in the provided list is required

  Scenario: Local Planning Department not in the list
    Given the list of Local Planning Department is presented
    When the user provides a Local Planning Department not in the provided list
    Then the user is informed that a Local Planning Department in the provided list is required
    And appeal is not updated with the unknown Local Planning Department

  Scenario: Some Local Planning Departments are not participating in this service
    Given the list of Local Planning Department is presented
    When the user provides a Local Planning Department that is not participating in this service
    Then the user is informed that the selected Local Planning Department is not participating in the service
    And appeal is updated with the ineligible Local Planning Department

  Scenario: Local Planning Department is successfully provided
    Given the list of Local Planning Department is presented
    When the user provides a Local Planning Department that is participating in this service
    Then the user can proceed and the appeal is updated with the Local Planning Department
