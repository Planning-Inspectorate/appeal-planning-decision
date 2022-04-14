@e2e
Feature: As an appellant/agent
  I want to provide the necessary details needed for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'What is your planning application number' to 'Did you submit a design and access statement with your application?'
    Given an appellant or agent is on the 'What is your planning application number' page
    When they select the Continue button
    Then they are presented with the 'Did you submit a design and access statement with your application?' page

  Scenario: 2 - Yes option is selected on 'Did you submit a design and access statement with your application?'
    Given an appellant or agent is on the Did you submit a design and access statement with your application? page
    When the user select 'Yes' and click continue
    Then they are presented with the 'Design and access statement' page

  Scenario: 3 - No option is selected on 'Did you submit a design and access statement with your application?'
    Given an appellant or agent is on the Did you submit a design and access statement with your application? page
    When they select 'No' and click continue
    Then they are presented with the 'Decision Letter' page

  Scenario: 4 - None of the options is selected on 'Did you submit a design and access statement with your application?'
    Given an appellant or agent is on the Did you submit a design and access statement with your application? page
    When they select the Continue button
    Then an error message 'Select yes if you submitted a design and access statement with your application' is displayed

  Scenario: 5 - Navigate from 'Did you submit a design and access statement with your application?' page back to 'What is your planning application number' page
    Given an appellant or agent is on the Did you submit a design and access statement with your application? page
    When they click on the 'Back' link
    Then the user are presented with plans and drawings documents page
