@wip
Feature: As an appellant/agent
  I want to enter the LPA Application number
  So that all the necessary details needed for my appeal to be processed are provided

  Scenario: 1 - Navigate from 'Planning Application form page' to 'What is your Planning Application Number' page
    Given an appellant or agent is on the 'Planning Application form' page
    When they click the 'Continue'
    Then 'What is your Planning Application Number' page is displayed
