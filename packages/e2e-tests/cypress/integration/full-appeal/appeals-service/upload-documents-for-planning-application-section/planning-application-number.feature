Feature: As an agent
  I want to enter my contact details So that all the necessary information needed for my appeal
  to be processed are provided

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1. Navigate from 'Planning Application form page' to 'What is your Planning Application Number’ page
    Given an agent is on the 'Planning Application form' page
    When they click the 'Continue' on File upload page
    Then 'What is your Planning Application Number' page is displayed

  Scenario: 2. Agent enters letters/numbers into the text box
    Given an agent is on the 'What is your Planning Application number' page
    When they enter text into the box and click 'Continue'
    Then the user are presented with plans and drawings documents page

  Scenario: 3. No characters entered in the text box
    Given an agent is on the 'What is your Planning Application number' page
    When they click the 'Continue'
    Then an error message 'Enter the original planning application number' is displayed

  Scenario: 4. More than 30 characters entered
    Given an agent has entered more than 30 characters into the text box
    When they click the 'Continue'
    Then an error message 'The application number must be no more than 30 characters' is displayed

  Scenario: 5. Navigate from 'What is your Planning Application number' page back to Task List
    Given an agent is on the 'What is your Planning Application number' page
    When they click on the 'Back' link
    Then they are presented with the 'Planning Application form' page
