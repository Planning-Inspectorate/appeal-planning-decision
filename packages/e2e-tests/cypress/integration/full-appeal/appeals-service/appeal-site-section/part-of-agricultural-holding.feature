Feature: As an appellant/agent
  I want to provide the details if the site is part of an agricultural holding for my application to be submitted
  So that I am sure that the information provided are accurate


  Scenario: 1 - Navigate from 'Do you own all of the land involved in the appeal?' to 'Is the appeal site part of an agricultural holding?'
    Given an appellant or agent is on the 'Do you own all of the land involved in the appeal' page
    When the user select 'Yes' and click 'Continue'
    Then 'Is the appeal site part of an agricultural holding' page is displayed with some guidance text

  Scenario: 2 - Yes option is selected on 'Is the appeal site part of an agricultural holding'
    Given an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page
    When the user select 'Yes' and click 'Continue'
    Then the user is taken to the next page 'Are you a tenant of the agricultural holding'

  Scenario: 3 - No option is selected on 'Is the appeal site part of an agricultural holding'
    Given an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page
    When the user select 'No' and click 'Continue'
    Then are taken to the next page 'Is the site visible from a public road'

  Scenario: 4 - None of the options is selected on 'Is the appeal site part of an agricultural holding'
    Given an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page
    When the user select 'None of the options' and click 'Continue'
    Then they are presented with an error message 'Select yes if the appeal site is part of an agricultural holding'

  Scenario: 5 - Navigate from 'Is the appeal site part of an agricultural holding' page back to 'Do you own all the land involved in the appeal' page
    Given an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page
    When they click on the 'Back' link
    Then they are presented with the 'Do you own all of the land involved in the appeal' page
