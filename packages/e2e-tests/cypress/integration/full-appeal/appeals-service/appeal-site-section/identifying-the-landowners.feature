@e2e
Feature: As an Appellant or Agent
  I want to provide the necessary details needed for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey
  #I know who owns some of the land:
  Scenario: 1 - Navigate from 'Do you know who owns the land involved in the appeal?' to 'Identifying the landowners'
    Given an Appellant or Agent is on the 'Do you know who owns the land involved in the appeal' page
    When the user selects 'I know who owns some of the land' and clicks 'Continue' button
    Then 'Identifying the landowners' page is displayed

  Scenario: 2 - Confirmation box is selected on the question 'Confirm that you have attempted to identify the landowners'
    Given an Appellant or Agent is on the 'Identifying the landowners' page
    And a statement 'Confirm that you have attempted to identify the landowners' is displayed
    When the user selects the confirmation box and clicks 'Continue'
    Then the user is taken to the next page 'Advertising your appeal'

  Scenario: 3 - The confirmation box is not selected on 'Confirm that you have attempted to identify the landowners'
    Given an Appellant or Agent is on the 'Identifying the landowners' page
    When the user clicks 'Continue' without selecting the confirmation box
    Then they are presented with an error message "Confirm if you've attempted to identify the landowners"

  Scenario: 4 - Navigate from 'Identifying the landowners' page back to 'Do you know who owns the land involved in the appeal?' page
    Given an Appellant or Agent is on the 'Identifying the landowners' page
    When they click on the 'Back' link
    Then they are presented with the 'Do you know who owns the land involved in the appeal' page and 'I know' option is selected

 # No, I do not know who owns any of the land
  Scenario: 5 - Navigate from 'Do you know who owns the land involved in the appeal?' to 'Identifying the landowners'
    Given an Appellant or Agent is on the 'Do you know who owns the land involved in the appeal' page
    When the user selects 'No, I do not know who owns any of the land' and clicks 'Continue' button
    Then 'Identifying the landowners' page is displayed with text 'Have you taken all reasonable steps to identify the landowners?'
    And the checkbox should not be selected

  Scenario: 6 - Confirmation box is selected on the question 'Have you taken all reasonable steps to identify the landowners'
    Given an Appellant or Agent is on the 'Identifying the landowners' page for the option 'No, I do not know who owns any of the land'
    When the user selects the confirmation box and clicks 'Continue'
    Then the user is taken to the next page 'Advertising your appeal'

  Scenario: 7 - The confirmation box is not selected on 'Have you taken all reasonable steps to identify the landowners'
    Given an Appellant or Agent is on the 'Identifying the landowners' page for the option 'No, I do not know who owns any of the land'
    When the user clicks 'Continue' without selecting the confirmation box
    Then they are presented with an error message "Confirm if you've attempted to identify the landowners"

  Scenario: 8 - Navigate from 'Identifying the landowners' page back to 'Do you know who owns the land involved in the appeal? page /full-appeal/submit-appeal/know-the-owners
    Given an Appellant or Agent is on the 'Identifying the landowners' page for the option 'No, I do not know who owns any of the land'
    When they click on the 'Back' link
    Then they are presented with the 'Do you know who owns the land involved in the appeal' page and 'No' option is selected
