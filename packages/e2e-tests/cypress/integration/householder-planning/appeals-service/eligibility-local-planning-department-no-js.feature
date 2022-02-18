@wip @has
@smoketest
Feature: A prospective appellant selects a Local Planning Department for the case they wish to appeal
    Not every LPA is taking part in this iteration of the service.
    ** This is expected behaviour when JavaScript is disabled in the user's browser. **

  Scenario: No Local Planning Department selected
    Given the user can select from a list of Local Planning Departments
    When the user does not select a Local Planning Department
    Then the user is informed that a Local Planning Department in the provided list must be selected

  Scenario: Selected Local Planning Department not in the list
    Given the user can select from a list of Local Planning Departments
    When the user selects the empty value from the list of Local Planning Departments
    Then the user is informed that a Local Planning Department in the provided list must be selected

  Scenario: Selected Local Planning Department is not participating in this service
    Given the user can select from a list of Local Planning Departments
    When the user selects a Local Planning Department that is not participating in this service
    Then the user is informed that the selected Local Planning Department is not participating in the service

  Scenario: Selected Local Planning Department is participating in this service
    Given the user can select from a list of Local Planning Departments
    When the user selects a Local Planning Department that is participating in this service
    Then the user can proceed and the appeal is updated with the selected Local Planning Department

