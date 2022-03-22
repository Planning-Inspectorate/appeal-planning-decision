Feature: As an appellant/agent
  I want to provide the details of any health and safety issues on the appeal site for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from the 'Is the site visible from a public road?' page to the 'Are there any health and safety issues on the appeal site?' page
    Given an appellant or agent is on the 'Is the site visible from a public road?' page
    When the user selects 'Yes' and clicks 'Continue'
    Then the 'Are there any health and safety issues on the appeal site?' page is displayed

  Scenario: 2 - Yes option is selected and details about the health and safety issues are entered on the 'Are there any health and safety issues on the appeal site?' page
    Given an appellant or agent is on the 'Are there any health and safety issues on the appeal site?' page
    When the user selects 'Yes' and enters details about the health and safety issues and clicks 'Continue'
    Then the user is taken to the 'Task List' page

  Scenario: 3 - Yes option is selected and details about health and safety issues are not entered on the 'Are there any health and safety issues on the appeal site?' page
    Given an appellant or agent is on the 'Are there any health and safety issues on the appeal site?' page
    When the user selects 'Yes' and clicks 'Continue'
    Then they are presented with an error message 'Tell us about the health and safety issues'

  Scenario: 4 - No option is selected on the 'Are there any health and safety issues on the appeal site?' page
    Given an appellant or agent is on the 'Are there any health and safety issues on the appeal site?' page
    When the user selects 'No' and clicks 'Continue'
    Then the user is taken to the 'Task List' page

  Scenario: 5 - More than 255 characters entered in the text box which appears if 'Yes' is selected
    Given an appellant or agent is on the 'Are there any health and safety issues on the appeal site?' page
    When the user selects No and Enter more than 255 characters in the text box and clicks 'Continue'
    Then they are presented with an error message 'Health and safety information must be 255 characters or less'

  Scenario: 6 - None of the options are selected on the 'Are there any health and safety issues on the appeal site?' page
    Given an appellant or agent is on the 'Are there any health and safety issues on the appeal site?' page
    When the user selects 'None of the options' and clicks 'Continue'
    Then they are presented with an error message 'Select yes if there are any health and safety issues on the appeal site'

  Scenario: 7 - Navigate from the 'Are there any health and safety issues on the appeal site?' page back to the 'Is the site visible from a public road?' page
    Given an appellant or agent is on the 'Are there any health and safety issues on the appeal site?' page
    When they click on the 'Back' link
    Then they are taken to the 'Is the site visible from a public road?' page
