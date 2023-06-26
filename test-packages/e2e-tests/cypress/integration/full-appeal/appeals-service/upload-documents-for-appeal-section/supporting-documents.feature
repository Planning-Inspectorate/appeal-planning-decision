Feature: As an Appellant or Agent
  I want to provide any supporting documents for Plans and drawings for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'Plans or drawings' page  to 'Do you have any other documents that support your appeal?'
    Given an Appellant or Agent is on the 'New plans or drawings' page
    When they select 'No' and clicks 'Continue' button
    Then 'Do you want to submit any new supporting documents with your appeal?' page is displayed

  Scenario: 2 - Yes option is selected on 'Supporting documents' page
    Given an Appellant or Agent is on the 'Supporting documents' page
    When they select 'Yes' and clicks 'Continue' button
    Then the user is taken to the next page 'New supporting documents' page

  Scenario: 3 - No option is selected on 'Supporting documents' page
    Given an Appellant or Agent is on the 'Supporting documents' page
    When they select 'No' and clicks 'Continue' button
    Then are taken back to the task list page
    # And the section 'upload documents for your appeal' is shown as 'complete'

  Scenario: 4 - None of the options is selected on 'Supporting documents' page
    Given an Appellant or Agent is on the 'Supporting documents' page
    When they select 'None of the options' and clicks 'Continue' button
    Then they are presented with an error message 'Select yes if you want to submit any new supporting documents with your appeal'

  Scenario: 5 - Navigate from 'Supporting documents' page back to 'New plans and drawings' page
    Given an Appellant or Agent is on the 'Supporting documents' page
    When they click on the 'Back' link
    Then they are presented with the 'New plans or drawings' page and the No option is selected
