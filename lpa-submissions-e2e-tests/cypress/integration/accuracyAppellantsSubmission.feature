Feature: Accuracy of the Apellants Submission

  As a beta LPA I want to respond whether the information from the appellant accurately reflects the original planning application
  so that the Planning Inspectorate can make a decision.

  Background:
    Given an appeal has been created
    And a questionnaire has been created
    And the LPA Planning Officer is authenticated

  Scenario: AC01 Access Review accuracy of the appellant's submission page
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    When the user selects the link "Review accuracy of the appellant's submission"
    Then the user is presented with the correct page
    And the radio group label is 'Does the information from the appellant accurately reflect the original planning application?'

  Scenario: AC02 LPA User does not select Yes or No
    Given the user is in the Review accuracy of the appellant's submission page
    When the user does not select an option
    And the user selects Save and Continue
    Then the user is shown the error message 'Select yes if the information accurately reflects the planning application'

  Scenario: AC03 LPA user selects Yes and proceeds to task list
    Given the user is in the Review accuracy of the appellant's submission page
    When the user selects 'Yes'
    And the user selects Save and Continue
    Then progress is made to the task list
    And a Completed status is populated on that sub-section of the task list

  Scenario: AC04 LPA user selects no and is presented with free text field
    Given the user is in the Review accuracy of the appellant's submission page
    When the user selects 'No'
    Then the user is provided with a free text field to input their reasons

  Scenario Outline: AC05 LPA user provides further information in text field and proceeds to task list
    Given the user is in the Review accuracy of the appellant's submission page
    When the user selects 'No'
    And the user enters '<inaccuracy_reason>'
    And the user selects Save and Continue
    Then progress is made to the task list
    And a Completed status is populated on that sub-section of the task list
    Examples:
      | inaccuracy_reason  |
      | Field is incorrect |
      | 1234567890 |
      | This is a really long paragraph. Here is the rest of the really long paragraph. All these words are in this one paragraph. |
      | Reason 1, Reason 2, Reason 3, Reason 4 |
      | a |
      |  abc123  |
      | Example with special characters ?!*/ |

  Scenario: AC06 LPA user does not provide further information in text field and is provided an error
    Given the user is in the Review accuracy of the appellant's submission page
    When the user selects 'No'
    And the user has not provided further information as text regarding their reasons
    And the user selects Save and Continue
    Then the user is shown the error message 'Enter details of why this does not accurately reflect the planning application'

  Scenario: AC07 Appeal details side panel
    Given the user is in the Review accuracy of the appellant's submission page
    Then the appeal details panel is displayed on the right hand side of the page

  Scenario: AC08 Selects back
    Given the user is in the Review accuracy of the appellant's submission page
    When the user selects 'No'
    And the user selects the back link
    Then progress is made to the task list
    And any information they have inputted will not be saved

  Scenario: AC09 LPA user has completed the "Review accuracy of the appellant's submission" page and returns to that sub section from the Task List
    Given a user has completed the information needed on the accuracy of the appellant's submission page
    When the user returns to the submission accuracy page from the Task List
    Then the information they previously entered is still populated

  Scenario: AC10 Change answers
    Given a change to answer 'Accuracy Appellant Submission' is requested from Change your answers page
    When an answer is saved
    Then progress is made to the Check Your Answers page
    And the updated answer is displayed
