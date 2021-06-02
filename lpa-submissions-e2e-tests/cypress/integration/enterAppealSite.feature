Feature: Enter Appeal Site
  As a LPA Planning Officer
  I want to provide details about the appeal site
  So that the Planning Inspectorate has the information it needs to decide the appeal.

  Scenario: AC01 LPA Officer navigates to Enter the appeal site
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    When LPA Planning Officer chooses to provide information about 'Enter the appeal site'
    Then LPA Planning Officer is presented with ability to add this information

  Scenario: AC02 The LPA does not provide an answer to Enter the appeal site
    Given 'Enter the appeal site' question has been requested
    When an answer to the question is not provided
    Then progress is halted with an error message to select an answer

  Scenario: AC03 LPA Officer selects Yes to Enter the appeal site and enters details why the inspector needs to enter the appeal site
    Given 'Enter the appeal site' question has been requested
    When the answer is 'yes'
    And the officer enters 'why the inspector will need access' in the text box that appears
    Then officer progresses to the task list from yes no question
    And the 'Enter the appeal site' subsection is shown as completed

  Scenario: AC04 LPA Officer selects Yes to Enter the appeal site but does not enter details why the inspector needs to enter the appeal site
    Given 'Enter the appeal site' question has been requested
    When the answer is 'yes'
    Then progress is halted with an error message to enter details

  Scenario: AC05 LPA Officer selects No to Enter the appeal site
    Given 'Enter the appeal site' question has been requested
    When the answer is 'no'
    Then officer progresses to the task list from yes no question
    And the 'Enter the appeal site' subsection is shown as completed

  Scenario: AC06 LPA Officer selects to return to the previous page
    Given 'Enter the appeal site' question has been requested
    When an answer is given but not submitted
    And Back is then requested
    Then the LPA Planning Officer is taken to the Task List
    And any data inputted will not be saved

  Scenario: AC07 LPA Officer returns to the completed Enter the appeal site question
    Given The yes or no question 'Enter the appeal site' has been completed
    When the inspector returns to the question
    Then the yes or no information they previously entered is still populated

  Scenario: AC08 Appeal details side panel
    Given 'Enter the appeal site' question has been requested
    Then the appeal details panel is displayed on the right hand side of the page

  Scenario: AC09 Check Your Answers Page
    Given the questionnaire has been completed
    When Check your Answers is displayed
    Then 'Enter the appeal site' yes or no question and answer should be displayed

  Scenario: AC10 Change answer from Check Your Answers Page
    Given a change to answer 'Enter the appeal site' is requested from Change your answers page
    When a yes or no answer is saved
    Then progress is made to the Check Your Answers page
    And the updated yes or no answer is displayed

  Scenario: AC11 PDF
    Given the questionnaire has been completed
    When the LPA Questionnaire is submitted
    Then 'Enter the appeal site' yes or no answer is displayed on the PDF
