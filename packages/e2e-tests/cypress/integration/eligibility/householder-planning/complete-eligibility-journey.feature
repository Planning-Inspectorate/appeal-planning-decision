Feature: Householder appeal Eligibility Journey

  Scenario Outline: Verify householder eligibility journey for '<application_decision>'
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant selects 'Householder' planning application type
    And appellant clicks on the continue button
    And appellant selects the option as No for listed building
    And appellant clicks on the continue button
    And appellant selects the '<application_decision>'
    And appellant clicks on the continue button
    And appellant enters the date within '<deadline_duration>' when the '<application_decision>' was received
    And appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    And appellant selects No from the claiming costs option
    And appellant clicks on the continue button
    Then appellant is navigated to householder appeal task list page
    Examples:
      | application_decision           |deadline_duration|
      | Granted                        |6 months         |
       | Refused                        |12 weeks         |
      | I have Not Received a Decision |6 months         |

  Scenario Outline: Verify householder eligibility journey for '<application_decision>'
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for local planning department
    When appellant clicks on the continue button
    And appellant selects 'Householder' planning application type
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for 'Householder' planning application type
    When appellant clicks on the continue button
    And appellant selects the option as No for listed building
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for the option as No for listed building
    When appellant clicks on the continue button
    And appellant selects the '<application_decision>'
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for '<application_decision>'
    When appellant clicks on the continue button
    And appellant enters the date within '<deadline_duration>' when the '<application_decision>' was received
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for the date within '<deadline_duration>' when the '<application_decision>' was received
    When appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for enforcement notice
    When appellant clicks on the continue button
    And appellant selects No from the claiming costs option
    And appellant clicks on the continue button
    And appellant clicks on browser back back
    Then data is persisted for No from the claiming costs option
    When appellant clicks on the continue button
    Then appellant is navigated to householder appeal task list page
    Examples:
      | application_decision           |deadline_duration|
      | Granted                        |6 months         |
      | Refused                        |12 weeks         |
      | I have Not Received a Decision |6 months         |
