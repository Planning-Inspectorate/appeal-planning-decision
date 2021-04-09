Feature: Task lists
  As an LPA user I want to clearly see which sections of the
  appeal submission I have completed, so that I do not waste my time checking.

  All the tasks should be "NOT STARTED"

  The "Check your answer" task state should be "CANNOT START YET"

  Scenario: LPA Questionnaire task list page is displayed with static text
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    Then the LPA Planning Officer is taken to the Task List

  Scenario Outline: When the tasks are presented, then user should be able to select them
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    Then The task <task> is available for selection
    Examples:
      | task                           |
      | "Accuracy Apellant Submission" |
      | "Extra Conditions"             |
      | "Other Appeals"                |
      | "Upload Plans"                 |
      | "Development Plan"             |

  Scenario Outline: User is able to navigate to tasklist page by clicking on back button
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    And The User clicks on <task>
    When User clicks on Back button
    Then the LPA Planning Officer is taken to the Task List
    Examples:
      | task                           |
      | "Accuracy Apellant Submission" |
      | "Extra Conditions"             |
      | "Other Appeals"                |
      | "Upload Plans"                 |
      | "Development Plan"             |

  Scenario Outline: When the lpa questionnaire is not started, then the tasks are in "NOT STARTED" state
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    Then The state for <task> is displayed to be "NOT STARTED"
    And The state for "Before You submit - Check your answers" is displayed to be "CANNOT START YET"
    Examples:
      | task                           |
      | "Accuracy Apellant Submission" |
      | "Extra Conditions"             |
      | "Other Appeals"                |
      | "Upload Plans"                 |
      | "Development Plan"             |
