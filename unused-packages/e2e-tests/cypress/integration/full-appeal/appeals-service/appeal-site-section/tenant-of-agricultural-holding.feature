Feature: As an appellant/agent
  I want to provide details about user is a tenant of the agricultural holding or not for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'Is the appeal site part of an agricultural holding  to 'Are you a tenant of the agricultural holding' page
    Given an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page
    When the user select 'Yes' and click 'Continue'
    Then 'Are you a tenant of the agricultural holding?' page is displayed

  Scenario: 2 - Yes option is selected on 'Are you a tenant of the agricultural holding?' page
    Given an appellant or agent is on the 'Are you a tenant of the agricultural holding?' page
    When the user select 'Yes' and click 'Continue'
    Then the user is taken to the next page 'Are there any other tenants?' page is displayed
    When they click on the 'Back' link
    Then the answer 'Yes' is selected in the 'Are there any other tenants?' page

  Scenario: 3 - No option is selected on 'Are you a tenant of the agricultural holding?' page
    Given an appellant or agent is on the 'Are you a tenant of the agricultural holding?' page
    When the user select 'No' and click 'Continue'
    Then are taken to the next page 'Telling the tenants'

  Scenario: 4 - None of the options is selected on 'Are you a tenant of the agricultural holding?'
    Given an appellant or agent is on the 'Are you a tenant of the agricultural holding?' page
    When the user select 'None of the options' and click 'Continue'
    Then they are presented with an error message 'Select yes if you are a tenant of the agricultural holding'

  Scenario: 5 -  Navigate from 'Are you a tenant of the agricultural holding?' page back to 'Is the appeal site part of an agricultural holding?' page
    Given an appellant or agent is on the 'Are you a tenant of the agricultural holding?' page
    When they click on the 'Back' link
    Then they are presented with the 'Is the appeal site part of an agricultural holding?' page
