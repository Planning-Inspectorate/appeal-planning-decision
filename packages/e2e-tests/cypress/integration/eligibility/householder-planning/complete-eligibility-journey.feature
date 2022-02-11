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
      | application_decision           | deadline_duration |
      | Granted                        | 6 months          |
      | Refused                        | 12 weeks          |
      | I have Not Received a Decision | 6 months          |
