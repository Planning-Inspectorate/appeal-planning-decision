@smoketest
Feature: A prospective appellant supplies a Local Planning Department for the case they wish to appeal
    Not every LPA is taking part in this iteration of the service.

  Scenario: Local Planning Department is required
    When the user does not provide a Local Planning Department
    Then the user is informed that a Local Planning Department is required

  Scenario: Some Local Planning Departments are not participating in this service
    When the user provides a Local Planning Department that is not participating in this service
    Then the user is informed that the selected Local Planning Department is not participating in the service
    And the user is directed to the Appeal a Planning Decision service

  Scenario: Local Planning Department is successfully provided
    When the user provides a Local Planning Department that is participating in this service
    Then the user can proceed with the provided Local Planning Department
