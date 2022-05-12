Feature: As an appellant who has made a prior approval application
  I want to make an appeal through the simple householder route
  So that my appeal can be dealt with more quickly.


  Scenario: AC-01 Navigate from ‘What type of planning application is your appeal about?’ to 'Did you apply for prior approval to extend an existing home?’
    Given an appellant is on the is your appeal about any of the following page
    When appellant selects 'Prior approval' and clicks continue
    Then appellant is presented with the next page Did you apply for prior approval to extend an existing home?

  Scenario: AC-02 Appellant selects 'Yes' to the question Did you apply for prior approval to extend an existing home?
    Given the appellant is on the Did you apply for prior approval to extend an existing home page
    When appellant selects 'yes' and click continue
    Then appellant is presented with the next page Is your appeal about a listed building

  Scenario: AC-03 Appellant has selected 'Yes' to the question 'Did you apply for prior approval to extend an existing home' and then selects 'Refusal' to the question ‘Was your planning application granted or refused'
    Given the appellant is on the Did you apply for prior approval to extend an existing home page
    And appellant selects 'yes' and click continue
    And appellant selects the option as No for listed building
    And appellant is on the was your planning application granted or refused page for householder
    When the appellant selects the option as 'Refused'
    Then appellant is navigated to Appeal a householder planning decision

  Scenario Outline: AC-04 - Appellant has selected ‘Yes’ to the question ‘Did you apply for prior approval to extend an existing home’ and then selects ‘Granted’ to the question ‘Was your planning application granted or refused'
    Given the appellant is on the Did you apply for prior approval to extend an existing home page
    And appellant selects 'yes' and click continue
    And appellant selects the option as No for listed building
    And appellant is on the was your planning application granted or refused page for householder
    When the appellant selects the option as '<application_decision>'
    Then appellant is navigated to Appeal a householder planning decision

    Examples:
      | application_decision           |
      | Granted                        |
      | I have not received a decision |

  Scenario Outline: AC-05 Appellant selects 'No' to the question Did you apply for prior approval to extend an existing home?
    Given the appellant is on the Did you apply for prior approval to extend an existing home page
    When appellant selects 'no' and click continue
    Then appellant is presented with the next page Was your planning application about any of the following
    And appellant is on the was your planning application granted or refused page
    When the appellant selects the option as '<application_decision>'
    Then appellant is navigated to Appeal a planning decision for '<application_decision>'
    Examples:
      | application_decision           |
      | Granted                        |
      | I have not received a decision |
      | Refused                        |

  Scenario: AC-06 - No selection is made to the question Did you apply for prior approval to extend an existing home?
    Given the appellant is on the Did you apply for prior approval to extend an existing home page
    When appellant clicks on the continue button
    Then appellant sees an error message 'Select yes if you applied for prior approval to extend an existing home'

  Scenario:AC-07 Navigate from ‘Did you apply for prior approval to extend an existing home?’ page back to ‘What type of planning application is your appeal about?’
    Given the appellant is on the Did you apply for prior approval to extend an existing home page
    When appellant clicks on back link
    Then appellant is presented with the What type of planning application if your appeal about page
