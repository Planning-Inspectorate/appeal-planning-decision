Feature: As an appellant/agent
  I want to provide evidence
  So that the Planning Inspectorate has all the information to support my appeal

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1. Navigate from ‘Planning application form’ to ‘Does the application form include site ownership and agricultural holdings certificate’ 
    Given an agent is on the Planning application form page
    When the user selects ‘Continue’
    Then the ‘Does the application form include site ownership and agricultural holdings certificate’ is displayed

  Scenario: 2. Yes option is selected on ‘Does the application form include site ownership and agricultural holdings certificate’
    Given an appellant/agent is on the ‘Does the application form include site ownership and agricultural holdings certificate’
    When the user selects ‘Yes, my application form includes site ownership and agricultural holdings declarations' and clicks ‘Continue’
    Then the user is taken to the ‘What is your planning application number’ page

  Scenario: 3. No option is selected on ‘Does the application form include site ownership and agricultural holdings certificate’
    Given an appellant/agent is on the ‘Does the application form include site ownership and agricultural holdings certificate’
    When the user selects ‘No, I submitted these separately' and clicks ‘Continue’
    Then the user is taken to the ‘Site ownership and agricultural holdings certificates’ page

  Scenario: 4. None of the options are selected on ‘Does the application form include site ownership and agricultural holdings certificate’
    Given an appellant/agent is on the ‘Does the application form include site ownership and agricultural holdings certificate’
    When either Yes or No has not been selected and they click continue
    Then they are presented with an error message ‘Select your site ownership and agricultural holdings certificates’
  
  Scenario: 5. Navigate from ‘Does the application form include site ownership and agricultural holdings certificate’ back to ‘Planning application form’
    Given an appellant/agent is on the ‘Does the application form include site ownership and agricultural holdings certificate’
    When they click on the back link
    Then they are presented with the ‘Planning application form' page