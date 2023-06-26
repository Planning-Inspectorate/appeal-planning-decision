Feature: As an appellant/agent
  I want to provide the necessary details needed for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'What is the address of the appeal site' to 'Do you own all the land involved in the appeal?'
    Given an appellant or agent is on the 'What is the address of the appeal site' page
    When they select the 'Continue' button
    Then 'Do you own all the land involved in the appeal' is displayed

  Scenario: 2 - Yes option is selected on 'Do you own all the land involved in the appeal?'
    Given an appellant or agent is on the 'Do you own all the land involved in the appeal' page
    When the user select 'Yes' and click 'Continue'
    Then the user is taken to the next page 'Is the appeal site part of an agricultural holding'

  Scenario: 3 - No option is selected on 'Do you own all the land involved in the appeal'
    Given an appellant or agent is on the 'Do you own all the land involved in the appeal' page
    When the user select 'No' and click 'Continue'
    Then they are taken to the next page 'Do you own some of the land involved in the appeal'

  Scenario: 4 - None of the options is selected on 'Do you own all the land involved in the appeal'
    Given an appellant or agent is on the 'Do you own all the land involved in the appeal' page
    When the user select 'None of the options' and click 'Continue'
    Then an error message 'Select yes if you own all the land involved in the appeal' is displayed

  Scenario: 5 -  Navigate from 'Do you own all the land involved in the appeal' page back to 'What is the address of the appeal site page'
    Given an appellant or agent is on the 'Do you own all the land involved in the appeal' page
    When they click on the 'Back' link
    Then they are presented with the 'What is the address of the appeal site' page
 #And Site Address Page should have all the previous entered data
