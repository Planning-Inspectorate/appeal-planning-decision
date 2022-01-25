Feature: Full Appeal Eligibility Journey

  Scenario Outline: Verify full eligibility journey for '<application_type>' and '<application_decision>'
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant selects '<application_type>' planning application type
    And appellant clicks on the continue button
    And appellant selects 'None of these' from the list of options
    And appellant clicks on the continue button
    And appellant selects the '<application_decision>'
    And appellant clicks on the continue button
    And appellant enters the date within 6 months when the '<application_decision>' was received
    And appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    Then appellant is navigated to full appeal task list page
    Examples:
      | application_type                   | application_decision           |
      | Full planning                      | Granted                        |
      | Outline planning                   | Granted                        |
      | Prior approval                     | Granted                        |
      | Reserved matters                   | Granted                        |
      | Removal or variation of conditions | Granted                        |
      | Full planning                      | Refused                        |
      | Outline planning                   | Refused                        |
      | Prior approval                     | Refused                        |
      | Reserved matters                   | Refused                        |
      | Removal or variation of conditions | Refused                        |
      | Full planning                      | I have Not Received a Decision |
      | Outline planning                   | I have Not Received a Decision |
      | Prior approval                     | I have Not Received a Decision |
      | Reserved matters                   | I have Not Received a Decision |
      | Removal or variation of conditions | I have Not Received a Decision |
