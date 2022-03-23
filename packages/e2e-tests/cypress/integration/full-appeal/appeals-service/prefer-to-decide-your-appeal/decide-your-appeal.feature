@e2e
Feature: As an Appellant or Agent
         I want to give reasons on how I want my appeal decided
         So that the Planning Inspectorate can take this into account when validating my appeal

  Background:
    Given appellant has completed full appeal eligibility journey

Scenario: 1 - Navigate from 'Appeal a Planning Decision page' to 'How would you prefer us to decide your appeal'
    Given an Appellant or Agent is on the 'Appeal a Planning Decision' page
    When the user click the link 'Tell us how you would prefer us to decide your appeal'
    Then 'How would you prefer us to decide your appeal?' page is displayed

Scenario: 2 - Written Representations option is selected on 'How would you prefer us to decide your appeal'
    Given an Appellant or Agent is on the 'How would you prefer us to decide your appeal' page
    When the user selects 'Written representations' and clicks on 'Continue' button
    Then the user is taken back to the 'Appeal a Planning Decision' task list page
    When they click on the 'browser back' button
    Then the option 'Written representations' should be selected
   # And the status on 'Tell us how your would prefer us to decide your appeal' has been updated to 'Complete'

Scenario: 2 - Hearing option is selected on 'How would you prefer us to decide your appeal'
    Given an Appellant or Agent is on the 'How would you prefer us to decide your appeal' page
    When the user selects 'Hearing' and clicks on 'Continue' button
    Then the user is taken to the next page 'Why would you prefer a hearing?'
    When they click on the 'Back' link
    Then the option 'Hearing' should be selected

Scenario: 3 - Inquiry option is selected on 'How would you prefer us to decide your appeal'
    Given an Appellant or Agent is on the 'How would you prefer us to decide your appeal' page
    When the user selects 'Inquiry' and clicks on 'Continue' button
    Then the user is taken to the next page 'Why would you prefer an inquiry?'
    When they click on the 'Back' link
    Then the option 'Inquiry' should be selected

Scenario: 4 - None of the options are selected on 'How would you prefer us to decide your appeal'
    Given an Appellant or Agent is on the 'How would you prefer us to decide your appeal' page
    When the user selects 'None of the options' and clicks on 'Continue' button
    Then the user is presented with an error message 'Select how you would prefer us to decide your appeal'

Scenario: 6 Navigate from 'How would you prefer us to decide your appeal' page back to Task List
    Given an Appellant or Agent is on the 'How would you prefer us to decide your appeal' page
    When they click on the 'Back' link
    Then the user is taken back to the 'Appeal a Planning Decision' task list page
