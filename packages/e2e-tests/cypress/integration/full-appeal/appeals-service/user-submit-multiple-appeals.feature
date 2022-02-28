Feature: As an Appellant or Agent
  I want to be able to submit more than one appeal
  So that the Planning Inspectorate can action on all my appeals submitted

  Scenario: 1 - Appellant submits more than one appeal
    Given an Appellant is on the 'Declaration' page
    When they click on 'Confirm and submit appeal' button
    Then they are taken to the 'Appeal submitted' page
    When the Appellant start their second Appeal in the same browser
    And they click on 'Confirm and submit appeal' button
    Then they are taken to the 'Appeal submitted' page
    When the Appellant start their third Appeal in the same browser
    Then they are on the 'What type of planning application is your appeal about?' page

  Scenario: 2 - Agent submits more than one appeal
    Given an Agent is on the 'Declaration' page
    When they click on 'Confirm and submit appeal' button
    Then they are taken to the 'Appeal submitted' page
    When the Agent start their second Appeal in the same browser
    And they click on 'Confirm and submit appeal' button
    Then they are taken to the 'Appeal submitted' page
    When the Agent start their third Appeal in the same browser
    Then they are on the 'What type of planning application is your appeal about?' page


