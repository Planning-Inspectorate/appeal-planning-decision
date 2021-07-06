Feature: Original planning application publicised
  As a LPA Planning Officer
  I want to provide details about the appeal site
  So that the Planning Inspectorate has the information it needs to decide the appeal.

  Background:
    Given an appeal has been created
    And a questionnaire has been created

  Scenario: AC01 LPA Officer navigates to Original planning application publicised
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    When LPA Planning Officer chooses to provide information about 'Original planning application publicised'
    Then LPA Planning Officer is presented with ability to add this information

  Scenario: AC02 The LPA does not provide an answer to Original planning application publicised
    Given 'Original planning application publicised' question has been requested
    When an answer to the question is not provided
    Then progress is halted with an error message to select an answer

  Scenario: AC03 LPA Officer selects Yes to Original planning application publicised
    Given 'Original planning application publicised' question has been requested
    When the answer is 'yes'
    Then officer progresses to the task list from yes no question
    And the 'Original planning application publicised' subsection is shown as completed

  Scenario: AC04 LPA Officer selects No to Original planning application publicised
    Given 'Original planning application publicised' question has been requested
    When the answer is 'no'
    Then officer progresses to the task list from yes no question
    And the 'Original planning application publicised' subsection is shown as completed

  Scenario: AC05 LPA Officer selects to return to the previous page
    Given 'Original planning application publicised' question has been requested
    When an answer is given but not submitted
    And Back is then requested
    Then the LPA Planning Officer is taken to the Task List
    And any data inputted will not be saved

  Scenario: AC06 LPA Officer returns to the completed Original planning application publicised question
    Given The yes or no question 'Original planning application publicised' has been completed
    When the inspector returns to the question
    Then the yes or no information they previously entered is still populated

  Scenario: AC07 Appeal details side panel
    Given 'Original planning application publicised' question has been requested
    Then the appeal details panel is displayed on the right hand side of the page

  Scenario: AC08 Check Your Answers Page
    Given the questionnaire has been completed
    When Check your Answers is displayed
    Then 'Original planning application publicised' yes or no question and answer should be displayed

  Scenario: AC09 Change answer from Check Your Answers Page
    Given the questionnaire has been completed
    And a change to answer 'Original planning application publicised' is requested from Change your answers page
    When a yes or no answer is saved
    Then progress is made to the Check Your Answers page
    And the updated yes or no answer is displayed

  Scenario: AC010 PDF
    Given the questionnaire has been completed
    When the LPA Questionnaire is submitted
    Then data from check your answer page for a yes or no question is displayed on the PDF
