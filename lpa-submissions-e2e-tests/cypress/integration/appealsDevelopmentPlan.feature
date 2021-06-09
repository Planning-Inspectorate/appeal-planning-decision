Feature: Appeals Development Plan
  As a beta LPA I want to inform the Planning Inspector of whether any Development Plan Document or Neighbourhood Plan relevant to the appeal has been submitted for examination,
  so that this can form part of the evidence on which the Inspector makes a decision

  Scenario: AC01 - The LPA Planning Officer navigates to the Development Plan Document and Neighbourhood Plan question
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    When the LPA Planning Officer chooses to provide information regarding the Development Plan and Neighbourhood Plan
    Then the LPA Planning Officer is presented with the ability to provide information

  Scenario: AC02 - The LPA Planning Officer does not provide an answer
    Given the Development Plan Document and Neighbourhood Plan question is requested
    When an answer is not provided
    Then progress is halted with an error message "Select yes if there is a relevant Development Plan or Neighbourhood Plan"

  Scenario: AC03 - The LPA Planning Officer selects No on the Development Plan Document and Neighbourhood Plan question
    Given the Development Plan Document and Neighbourhood Plan question is requested
    When there is not a Development plan document or Neighbourhood plan
    Then progress is made to the task list
    And the Development Plan Document subsection is shown as completed

  Scenario Outline: AC04 - The LPA Planning Officer provides details about the Development Plan Document and Neighbourhood Plan
    Given there is a Development Plan Document and Neighbourhood Plan
    When details are provided about the plan '<plan_details>'
    Then progress is made to the task list
    And the Development Plan Document subsection is shown as completed
    Examples:
      | plan_details                                                                                                                                                                                                                                     |
      | some more plan_details                                                                                                                                                                                                                           |
      | plan_details with a space at the beginning                                                                                                                                                                                                       |
      | plan_details with special characters ,. !" }]* & -+%$£@!                                                                                                                                                                                         |
      | a very long piece of plan_details a very long piece of plan_details\na very long piece of plan_details a very long piece of plan_details\na very long piece of plan_details a very long piece of plan_details\na very long piece of plan_details |

  Scenario: AC05 - The LPA Planning Officer does not provide details about the Development Plan Document and Neighbourhood Plan
    Given there is a Development Plan Document and Neighbourhood Plan
    When no details are given about the plan
    Then progress is halted with an error message "Enter the relevant information about the plan and this appeal"

  Scenario: AC06 - Back link
    Given the Development Plan Document and Neighbourhood Plan question is requested
    When the LPA Planning Officer chooses to go to the previous page
    Then the LPA Planning Officer is taken to the Task List
    And any information they have entered will not be saved

  Scenario: AC07 - Appeal details side panel
    Given the Development Plan Document and Neighbourhood Plan question is requested
    Then the appeal details panel on the right hand side of the page can be viewed

  Scenario: AC08 - The LPA Planning Officer has selected no and completed the Development Plan Document and Neighbourhood Plan question and returns to that page from the Task List
    Given the LPA Planning Officer has selected no and completed the Development Plan Document and Neighbourhood Plan question
    When the LPA Planning Officer returns to the Development Plan Document and Neighbourhood Plan question from the Task List
    Then no is still selected

  Scenario: AC09 - The LPA Planning Officer has selected yes, entered plan details, and completed the Development Plan Document and Neighbourhood Plan question and returns to that page from the Task List
    Given the LPA Planning Officer has selected yes, entered plan details, and completed the Development Plan Document and Neighbourhood Plan question
    When the LPA Planning Officer returns to the Development Plan Document and Neighbourhood Plan question from the Task List
    Then yes is still selected, and plan details are still populated

  Scenario: AC10 - Change answers
    Given a change to answer 'Development Plan' is requested from Change your answers page
    When an answer is saved
    Then progress is made to the Check Your Answers page
    And the updated answer is displayed
