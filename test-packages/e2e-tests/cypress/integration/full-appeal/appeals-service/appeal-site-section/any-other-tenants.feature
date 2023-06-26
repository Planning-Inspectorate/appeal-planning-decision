Feature: As an appellant or agent
  I want to provide if there are any other Tenants for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'Are you a tenant of the agricultural holding?' to 'Are there any other tenants' page
    Given an appellant or agent is on the Are you a tenant of the agricultural holding page
    When the user select 'Yes' and click 'Continue'
    Then 'Are there any other tenants' page is displayed

  Scenario: 2 - Yes option is selected on 'Are there any other tenants' page
    Given an appellant or agent is on the 'Are there any other tenants' page
    When the user select 'Yes' and click 'Continue'
    Then the user is taken to the next page 'Telling the other tenants'

  Scenario: 3 - No option is selected on 'Are there any other tenants' page
    Given an appellant or agent is on the 'Are there any other tenants' page
    When the user select 'No' and click 'Continue'
    Then the user is taken to the next page 'Is the site visible from a public road?'
    When they click on the 'Back' link
    Then 'Are there any other tenants' page is displayed
    And the option 'No' is selected

  Scenario: 4 - None of the options are selected on 'Are there any other tenants' page
    Given an appellant or agent is on the 'Are there any other tenants' page
    When the user select 'None of the options' and click 'Continue'
    Then they are presented with an error message 'Select yes if there are any other tenants'

  Scenario: 5 - Navigate from 'Are there any other tenants?' page back to 'Are you a tenant of the agricultural holding?'
    Given an appellant or agent is on the 'Are there any other tenants' page
    When they click on the 'Back' link
    Then they are presented with the 'Are you a tenant of the agricultural holding?'
