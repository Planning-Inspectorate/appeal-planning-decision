@smoketest
Feature: The user gives the original appellant name
  The users needs to give the original appellant name to save and continue.


  Scenario: The user provided a bad format original appellant name and cannot proceed
    When the user provides the name with a bad format
    Then the user is informed that the provided name has a bad format

  Scenario: The user does not provide the original and cannot proceed
    When the user does not provides the name
    Then the user is informed that the name is missing

  Scenario: The user provided the original appellant name and can proceed
    When the user provides the name
    Then the user can proceed
