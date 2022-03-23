Feature: As an Appellant or Agent
  I want to upload plans and drawings needed for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'Your appeal statement' to 'Do you have any new plans or drawings that support your appeal'
    Given an Appellant or Agent is on the 'Appeal statement' page
    When the user uploads a document and selects the confirm box
    Then 'Do you have any new plans or drawings that support your appeal' page is displayed

  Scenario: 2 - Yes option is selected on 'Do you have any new plans or drawings that support your appeal' page
    Given an Appellant or Agent is on the 'Do you have any new plans or drawings that support your appeal' page
    When the user selects 'Yes' and clicks 'Continue' button
    #Then the user is taken to the next page 'Plans or drawings Upload' page(page url not updated as per new prototype)

  Scenario: 3 - No option is selected on 'Do you have any new plans or drawings that support your appeal' page
    Given an Appellant or Agent is on the 'Do you have any new plans or drawings that support your appeal' page
    When the user selects 'No' and clicks 'Continue' button
    Then are taken to the next page 'Supporting Documents'

  Scenario: 4 - None of the options is selected on 'Do you have any new plans or drawings that support your appeal' page
    Given an Appellant or Agent is on the 'Do you have any new plans or drawings that support your appeal' page
    When the user selects 'None of the options' and clicks 'Continue' button
    Then they are presented with an error message 'Select yes if you want to submit any new plans and drawings with your appeal'

  Scenario: 5 - Navigate from 'Do you have any new plans or drawings that support your appeal' page back to 'Your appeal statement' page
    Given an Appellant or Agent is on the 'Do you have any new plans or drawings that support your appeal' page
    When they click on the 'Back' link
    Then they are presented with the 'Your appeal statement' page with the uploaded file is displayed and confirm checkbox selected
