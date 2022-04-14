@e2e
Feature: As an appellant/agent
  I want to provide the necessary details needed for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1. Navigate from 'Appeal a Planning Decision page' to 'Provide your contact details' page and select 'Yes' the application made was made in my name
    Given the user click 'Provide your contact details' link
    Then 'Provide your contact details' page is displayed

  Scenario: 2. Yes option is selected on 'Was the planning application made in your name'
    Given an 'Appellant' is on the 'Was the planning application made in your name' page
    When the user select 'Yes, the planning application was made in my name' and continue
    Then the user is taken to the next page to provide their 'Contact Details'

  Scenario: 3. No option is selected on 'Was the planning application made in your name'
    Given an 'Agent' is on the 'Was the planning application made in your name' page
    When the user select 'No, I'm acting on behalf of the applicant' and continue
    Then are taken to the next page to provide the 'Applicant's name'

  Scenario: 4. None of the options is selected on 'Was the planning application made in your name'
    Given an 'Appellant or Agent' is on the 'Was the planning application made in your name' page
    When no selection is made and they click Continue
    Then an error message 'Select yes if the planning application was made in your name' is displayed

  Scenario: 5. Navigate from 'Was the planning application made in your name' page back to Task List
    Given an 'Appellant or Agent' is on the 'Was the planning application made in your name' page
    When they click on the 'Back' link
    Then they are presented with the 'Appeal a planning decision' task list page

