@smoketest
@wip
Feature: A user is asked if he or she's the original appellant
  If the user is not the original appellant, his name should be asked


  Scenario: The user is the original appellant
    When the user has stated that they "are not" the original appellant
    Then the user will "not be" asked who they are representing

  Scenario: The user is not the original appellant
    When the user has stated that they "are" the original appellant
    Then the user will "be" asked who they are representing
