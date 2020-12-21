@smoketest
Feature: A user is asked if they are the original appellant
  If the user is not the original appellant, his name should be asked

  Scenario: The user never answered and try proceed without answering
    Given the user "had not" previously stated "being or not" the original appellant
    When the user does not state being or not the original appellant
    Then the user is told "Select yes if you are the original appellant"

  Scenario: The user answers for the first time and the answer is that their not the original appellant
    Given the user "had not" previously stated "being or not" the original appellant
    When the user states that they "are not" the original appellant
    Then the user will "be" asked who they are representing
    And the user can see that their appeal has been updated with the "no" answer

  Scenario: The user answers for the first time and the answer is that their are the original appellant
    Given the user "had not" previously stated "being or not" the original appellant
    When the user states that they "are" the original appellant
    Then the user will "not be" asked who they are representing
    And the user can see that their appeal has been updated with the "yes" answer

  Scenario: The user had previously answered being the original appellant and now changes their answer
    Given the user "had" previously stated "being" the original appellant
    When the user states that they "are not" the original appellant
    Then the user will "be" asked who they are representing
    And the user can see that their appeal has been updated with the "no" answer

  Scenario: The user had previously answered not being the original appellant and now changes their answer
    Given the user "had" previously stated "not being" the original appellant
    When the user states that they "are" the original appellant
    Then the user will "not be" asked who they are representing
    And the user can see that their appeal has been updated with the "yes" answer
