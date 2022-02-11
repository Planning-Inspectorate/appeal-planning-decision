Feature: Householder appeal Eligibility Journey

  Scenario Outline: AC01 - Verify householder eligibility journey for '<application_decision>'
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


  Scenario Outline: AC02 - Verify householder eligibility journey for '<application_decision>' and data persistence
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
    And appellant clicks on browser back
    Then data is persisted for No from the claiming costs option
    When appellant clicks on the continue button
    Then appellant is navigated to householder appeal task list page
    Examples:
      | application_decision           |deadline_duration|
      | Granted                        |6 months         |
      | Refused                        |12 weeks         |
      | I have Not Received a Decision |6 months         |

  Scenario Outline: AC03 - Verify eligibility journey from Householder to <application_type>
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant selects 'Householder' planning application type
    When appellant clicks on the continue button
    And appellant selects the option as No for listed building
    When appellant clicks on the continue button
    And appellant selects the 'Refused'
    And appellant clicks on the continue button
    And appellant enters the date within '12 weeks' when the 'Refused' was received
    And appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    And appellant selects No from the claiming costs option
    And appellant clicks on the continue button
    Then appellant is navigated to householder appeal task list page
    When appellant clicks on browser back
    And data is persisted for No from the claiming costs option
    And appellant clicks on back link
    And data is persisted for enforcement notice
    And appellant clicks on back link
    And data is persisted for the date within '12 weeks' when the 'Refused' was received
    And appellant clicks on back link
    And data is persisted for 'Refused'
    And appellant clicks on back link
    And data is persisted for the option as No for listed building
    And appellant clicks on back link
    And data is persisted for 'Householder' planning application type
    When appellant selects '<application_type>' planning application type
    And appellant clicks on the continue button
    And appellant selects 'None of these' from the list of options
    And appellant clicks on the continue button
    And appellant selects the '<application_decision>' for '<application_type>'
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
