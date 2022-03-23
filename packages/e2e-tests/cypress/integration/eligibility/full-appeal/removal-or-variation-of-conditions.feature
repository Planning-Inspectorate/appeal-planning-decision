@e2e
Feature: As an Appellant or Agent who has made an application to Remove or vary a Condition
  I want to make an appeal through the simple Full Planning or Householder route
  So that my appeal can be dealt with more quickly

  Scenario:  AC-01 - Navigate from ‘What type of planning application is your appeal about?’ to ‘Are the conditions for householder planning permission?'
    Given the appellant is on the is your appeal about any of the following page
    When they select 'Removal or variation of conditions' and click continue
    Then they are presented with the next page 'Are the conditions for householder planning permission?'

  Scenario: AC-02 - Appellant selects 'Yes' to the question 'Are the conditions for householder planning permission?'
    Given the appellant is on the 'Are the conditions for householder planning permission?' page
    When they select the option 'Yes' and click Continue
    Then they are presented with the next page 'Is your appeal about a listed building'

  Scenario: AC-03 - Appellant selects ‘Yes’ to the question ‘Are the conditions for householder planning permission’ and then selects ‘Refusal’ to the question ‘Was your planning application granted or refused'
    Given the appellant is on the 'Are the conditions for householder planning permission?' page
    And they select the option 'Yes' and click Continue
    And they selects the option as 'No' for listed building
    And they are on the 'Was your planning application granted or refused' page for householder
    When they select the option as 'Refused' and click Continue
    Then they are navigated to the 'Appeal a householder planning decision' page

  Scenario Outline: AC-04 - Appellant selects 'Yes' to the question ‘Are the conditions for householder planning permission’ and then selects 'Granted or Not received decision' to the question 'Was your planning application granted or refused'
    Given the appellant is on the 'Are the conditions for householder planning permission?' page
    And they select the option 'Yes' and click Continue
    And they selects the option as 'No' for listed building
    And they are on the 'Was your planning application granted or refused' page for householder
    When they selects the option as '<application_decision>'
    Then they are navigated to 'Appeal a planning decision' page for '<application_decision>'
    Examples:
      | application_decision           |
      | Granted                        |
      | I have not received a decision |

  Scenario Outline: AC-05 Appellant selects 'No' to the question 'Are the conditions for householder planning permission?' then they are navigated to the Full Planning journey
    Given the appellant is on the 'Are the conditions for householder planning permission?' page
    When they select the option 'No' and click Continue
    Then they are on the next page 'Was your planning application about any of the following'
    When they select the option 'None of these'
    Then they are on the 'Was your planning application granted or refused' page
    When they selects the option as '<application_decision>'
    Then they are navigated to 'Appeal a planning decision' page for '<application_decision>'
    Examples:
      | application_decision           |
      | Granted                        |
      | I have not received a decision |
      | Refused                        |

  Scenario: AC-06 - No selection is made to the question 'Are the conditions for householder planning permission?'
    Given the appellant is on the 'Are the conditions for householder planning permission?' page
    When they click on the Continue button
    Then appellant sees an error message 'Select yes if the conditions are for householder planning permission'

  Scenario: AC-07 - Navigate from 'Are the conditions for householder planning permission?' page back to ‘What type of planning application is your appeal about?’
    Given the appellant is on the 'Are the conditions for householder planning permission?' page
    When appellant clicks on back link
    Then appellant is presented with the What type of planning application if your appeal about page
