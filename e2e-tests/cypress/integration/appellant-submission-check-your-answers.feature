Feature: A user checks their answers and wants to submit their appeal

  Scenario: The user has valid data and wants to submit their appeal
    Given the user is presented with the answers they had provided
    When the user confirms their answers
    Then the user should be presented with the Terms and Conditions of the service

  Scenario: AC1 - Accessing check your answers from the task list
    Given the completed task list page is displayed
    When Check Your Answers is accessed
    Then the appeal information is presented

  @AS-121
  Scenario: other owner notification question is displayed when the Appellant/agent does not own whole site
    Given an agent or appellant is reviewing their answers and they do not wholly own the site
    When Check Your Answers is presented
    Then the answer for other owner notification is displayed with a change link

  @AS-121
  Scenario: other owner notification question is not displayed when the Appellant/agent does own whole site
    Given an agent or appellant is reviewing their answers and they wholly own the site
    When Check Your Answers is presented
    Then the answer for other owner notification is not displayed

  @AS-121
  Scenario: show other owner notification question and answer with a change link to the CYA page when the appellant/agent have informed the other owners
    Given an agent or appellant has provided information where they have informed the other owners
    When Check Your Answers is presented
    Then the positive answer for other owner notification is displayed with a change link

  @AS-121
  Scenario: show other owner notification question and answer with a change link to the CYA page when the appellant/agent have not informed the other owners
    Given an agent or appellant has provided information where they have not informed the other owners
    When Check Your Answers is presented
    Then the negative answer for other owner notification is displayed with a change link

  @AS-121
  Scenario: Change link navigates to the other owner notification page
    Given an agent or appellant has provided information where they have not informed the other owners
    When Check Your Answers is presented
    And agent or appellant decide to change their other owner notification answer from no to yes
    Then the positive answer for other owner notification is displayed with a change link
