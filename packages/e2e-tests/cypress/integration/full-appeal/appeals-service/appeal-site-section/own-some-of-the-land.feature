Feature: As an appellant/agent
         I want to provide the necessary details needed for my application to be submitted
         So that I am sure that the information provided are accurate

  Scenario: 1 - Navigate from 'Do you own all the land involved in the appeal' to 'Do you own some of the land involved in the appeal?'
    Given an appellant or agent is on the 'Do you own all the land involved in the appeal' page
    When the user select 'No' and click 'Continue'
    Then 'Do you own some of the land involved in the appeal' page is displayed

  Scenario: 2 - Yes option is selected on 'Do you own some of the land involved in the appeal?'
    Given an appellant or agent is on the 'Do you own some of the land involved in the appeal' page
    When the user select 'Yes' and click 'Continue'
    Then the user is taken to the next page 'Do you know who owns the rest of the land involved in the appeal?'

  Scenario: 3 - No option is selected on 'Do you own some of the land involved in the appeal'
    Given an appellant or agent is on the 'Do you own some of the land involved in the appeal' page
    When the user select 'No' and click 'Continue'
    Then the user is taken to the next page 'Do you know who owns the land involved in the appeal'

  Scenario: 4 - None of the options is selected on 'Do you own some of the land involved in the appeal'
    Given an appellant or agent is on the 'Do you own some of the land involved in the appeal' page
    When the user select 'None of the options' and click 'Continue'
    Then an error message 'Select yes if you own some of the land involved in the appeal' is displayed

  Scenario: 5 - Navigate from 'Do you own some of the land involved in the appeal' page back to 'Do you own all the land involved in the appeal' page
    Given an appellant or agent is on the 'Do you own some of the land involved in the appeal' page
    When they click on the 'Back' link
    Then they are presented with the 'Do you own all the land involved in the appeal' page
