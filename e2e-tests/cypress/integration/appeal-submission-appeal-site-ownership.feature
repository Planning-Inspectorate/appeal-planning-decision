@wip
Feature: Prospective Appellant provides the Appeal Site Ownership
  Prospective appellant asked if owner of the whole site and if not asked if other owners have been told about the appeal.
  
  Scenario: The user never submitted site ownership and try proceed without answering
    Given the user "had not" previously stated "being or not" the whole site owner
    When the user does not state being or not the whole site owner
    Then the user is told "Select yes if you own the whole appeal site"

  Scenario: The user is the owner of whole site and never submitted site ownership
    Given the user "had not" previously stated "being or not" the whole site owner
    When the user states "being" the whole site owner
    Then the user "is" asked if other owners have been told
    And the user can see that their appeal has been updated with "yes" answer

  Scenario: The user is not the owner of whole site and never submitted site ownership
    Given the user "had not" previously stated "being or not" the whole site owner
    When the user states "not being" the whole site owner
    Then the user "is not" asked if other owners have been told
    Then the user can see that the "site ownership" has been updated with "no" answer

  Scenario: The user is not the owner and user don't answer if other owners are told
    Given the user "had" previously stated "being" the whole site owner
    When the user does not state if other owners have been told
    Then the user is told "Select yes if you have told the other owners"

  Scenario: The user is not the owner and other owners are told
    Given the user "had" previously stated "being" the whole site owner
    When the user states that other owners have "been" told
    Then the user can see that the "other owner told" has been updated with "yes" answer

  Scenario: The user is not the owner and other owners are not told
    Given the user "had" previously stated "being" the whole site owner
    When the user states that other owners have "been" told
    Then the user can see that the "other owner told" has been updated with "yes" answer

  Scenario: The user is not the owner of whole site and already submitted site ownership
    Given the user "had" previously stated "being" the whole site owner
    When the user states "not being" the whole site owner
    Then the user "is not" asked if other owners have been told
    Then the user can see that their appeal site ownership has been updated with "no" answer
    And  the user can see that the "other owner told" has been updated with "blank" answer
