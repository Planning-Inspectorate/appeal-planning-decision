Feature: As an appellant/agent
  I want to provide the details if the site is visible form a public road for my application to be submitted
  So that I am sure that the information provided are accurate

  Scenario: 1 - Navigate from 'Is the appeal site part of an agricultural holding?' to 'Is the site visible from a public road?'
    Given an appellant or agent is on the 'Is the appeal site part of an agricultural holding?' page
    When the user selects 'No' and clicks 'Continue'
    Then the 'Is the site visible from a public road?' page is displayed

  Scenario: 2 - Yes option is selected on the 'Is the site visible from a public road?' page
    Given an appellant or agent is on the 'Is the site visible from a public road?' page
    When the user selects 'Yes' and clicks 'Continue'
    Then the user is taken to the next page 'Are there any health and safety issues on the appeal site?'

  Scenario: 3 - No option is selected and details about how the visibility is restricted are entered on the 'Is the site visible from a public road?' page
    Given an appellant or agent is on the 'Is the site visible from a public road?' page
    When the user selects 'No' and enters details about how the visibility is restricted and clicks 'Continue'
    Then the user is taken to the next page 'Are there any health and safety issues on the appeal site?'

  Scenario: 4 - No option is selected and details about how the visibility is restricted are not entered on the 'Is the site visible from a public road?' page
    Given an appellant or agent is on the 'Is the site visible from a public road?' page
    When the user selects 'No' and clicks 'Continue'
    Then they are presented with an error message 'Tell us how visibility is restricted'

  Scenario: 5 - More than 255 characters entered in the text box which appears if 'No' is selected.
    Given an appellant or agent is on the 'Is the site visible from a public road?' page
    When the user selects No and Enter more than 255 characters in the text box and clicks 'Continue'
    Then they are presented with an error message 'How visibility is restricted must be 255 characters or less'

  Scenario: 6 - None of the options are selected on the 'Is the appeal site part of an agricultural holding' page
    Given an appellant or agent is on the 'Is the site visible from a public road?' page
    When the user selects 'None of the options' and clicks 'Continue'
    Then they are presented with an error message 'Select yes if the site is visible from a public road'

  Scenario: 7 - Navigate from the 'Is the site visible from a public road?' page back to the 'Is the appeal site part of an agricultural holding?' page
    Given an appellant or agent is on the 'Is the site visible from a public road?' page
    When they click on the 'Back' link
    Then they are presented with the 'Is the appeal site part of an agricultural holding?' page
