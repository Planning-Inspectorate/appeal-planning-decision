@wip
Feature: A prospective appellant confirms the information sent is accurate and the appeal can be fully considered

  Scenario: Prospective appellant verify details in about you before submitting the appeal
    Given the user has submitted username and email
    When the user is checking the answers before submitting the appeal
    Then the user can see the submitted values
    And the user can proceed to verify terms and conditions

  Scenario: Prospective appellant update details in about you before submitting the appeal
    When the user is checking the answers before submitting the appeal
    And the user wishes to change their username and email
    Then the user can see the updated values
    And the user can proceed to verify terms and conditions

  Scenario: Prospective appellant update username before submitting the appeal
    When the user is checking the answers before submitting the appeal
    And the user wishes to change the username
    Then the user can see the updated value
    And the user can proceed to verify terms and conditions

  Scenario: Prospective appellant update email before submitting the appeal
    When the user is checking the answers before submitting the appeal
    And the user wishes to change the email
    Then the user can see the updated value
    And the user can proceed to verify terms and conditions
