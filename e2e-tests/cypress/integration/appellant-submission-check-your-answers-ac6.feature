Feature: A user checks their answers and wants to submit their appeal

  @AS-121
  Scenario: other owner notification question is not displayed when the Appellant/agent does own whole site
    Given an agent or appellant is reviewing their answers and they wholly own the site
    When Check Your Answers is presented
    Then the answer for other owner notification is not displayed
