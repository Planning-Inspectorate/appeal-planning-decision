@wip
Feature: As an appellant/agent
         I want to enter the LPA Application number
         So that all the necessary details needed for my appeal to be processed are provided

  Scenario: 1 - Navigate from 'Planning Application form page' to 'What is your Planning Application Number' page
    Given an appellant or agent is on the 'Planning Application form' page
    When they click the 'Continue'
    Then 'What is your Planning Application Number' page is displayed


  Scenario: 2 - Appellant/Agent enters letters/numbers into the text box
    Given an appellant or agent is on the 'What is your Planning Application number' page
    When they enter text into the box and click 'Continue'
    Then the page 'Did you submit a design and access statement with your application?' is displayed

  Scenario: 3 - No characters entered in the text box

#    Given an appellant or agent has not provided any details
#    When they click the 'Continue'
#    Then an error message 'Enter the original planning application number' is displayed
#    And are unable to continue until text has been entered
#
#  Scenario: 4 - More than 30 characters entered
#
#    Given an appellant or agent has entered more than 30 characters into the text box
#    When they click the 'Continue'
#    Then an error message 'The application number must be no more than 30 characters' is displayed
#    And they are unable to continue
#
#  Scenario: 5 - Navigate from 'What is your Planning Application number' page back to Task List
#    Given an appellant or agent is on the 'What is your planning application' page
#    When they click on the 'Back' link
#    Then they are presented with the 'Planning Application form' page
