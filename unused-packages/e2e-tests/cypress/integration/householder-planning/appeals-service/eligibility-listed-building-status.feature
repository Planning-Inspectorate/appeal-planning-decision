@wip @has @smoketest
Feature: A prospective appellant states whether or not their appeal covers a listed building
    Our service doesn't cover listed buildings.

  @as-1670
  Scenario: Listed Building statement is required
    When the user does not provide a Listed Building statement
    Then the user is informed that a Listed Building statement is required

  Scenario: User selects yes option in the Is your appeal about a listed building page
    When the user states that their case concerns a Listed Building
    Then the user is informed that cases concerning a Listed Building cannot be processed via this service
    And the user is directed to the Appeal a Planning Decision service

  Scenario: User selects no option in the Is your appeal about a listed building page
    When the user states that their case does not concern a Listed Building
    Then the user can proceed to the claiming Costs eligibility check

  @as-1854
  Scenario: Should retain the selected answer on re-visiting the page
    Given the user states that their case does not concern a Listed Building
    When the user returns to the listed building page
    Then the user sees their previous given answer is correctly displayed
