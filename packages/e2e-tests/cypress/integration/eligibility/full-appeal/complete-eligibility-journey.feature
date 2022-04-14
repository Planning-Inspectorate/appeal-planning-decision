@smoketest @e2e
Feature: Full Appeal Eligibility Journey

  Scenario Outline: AC01 - Verify full eligibility journey for '<application_type>' and '<application_decision>'
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
      | Prior approval                     | Refused                       |
      | Reserved matters                   | Refused                        |
      | Removal or variation of conditions | Refused                        |
      | Full planning                      | I have Not Received a Decision |
      | Outline planning                   | I have Not Received a Decision |
      | Prior approval                     | I have Not Received a Decision |
      | Reserved matters                   | I have Not Received a Decision |
      | Removal or variation of conditions | I have Not Received a Decision |


  Scenario Outline: AC02 - Verify full eligibility journey for '<application_type>' and '<application_decision>' and data persistence
    Given appellant selects local planning department
    When appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for local planning department
    When appellant clicks on the continue button
    And appellant selects '<application_type>' planning application type
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for '<application_type>' planning application type
    When appellant clicks on the continue button
    And appellant selects 'None of these' from the list of options
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for 'None of these' from the list of options
    When appellant clicks on the continue button
    And appellant selects the '<application_decision>'
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for '<application_decision>'
    When appellant clicks on the continue button
    And appellant enters the date within 6 months when the '<application_decision>' was received
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for the date when the '<application_decision>' was received
    When appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    And appellant clicks on browser back
    Then data is persisted for enforcement notice
    When appellant clicks on the continue button
    Then appellant is navigated to full appeal task list page
    Examples:
      | application_type | application_decision           |
      | Full planning    | Granted                        |
      | Outline planning | Granted                        |
      | Reserved matters | Granted                        |
      | Full planning    | Refused                        |
      | Outline planning | Refused                        |
      | Reserved matters | Refused                        |
      | Full planning    | I have Not Received a Decision |
      | Outline planning | I have Not Received a Decision |
      | Reserved matters | I have Not Received a Decision |

  Scenario Outline: AC03 - Verify full eligibility journey for '<application_type>' and '<application_decision>' and data persistence
    Given appellant selects local planning department
    When appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for local planning department
    When appellant clicks on the continue button
    And appellant selects Prior approval planning application type
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for '<application_type>' planning application type
    And appellant clicks on the continue button
    When appellant selects the option no for prior approval existing house
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for option no for prior approval existing house
    And appellant clicks on the continue button
    And appellant selects 'None of these' from the list of options
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for 'None of these' from the list of options
    When appellant clicks on the continue button
    And appellant selects the '<application_decision>'
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for '<application_decision>'
    When appellant clicks on the continue button
    And appellant enters the date within 6 months when the '<application_decision>' was received
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for the date when the '<application_decision>' was received
    When appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    And appellant clicks on browser back
    Then data is persisted for enforcement notice
    When appellant clicks on the continue button
    Then appellant is navigated to full appeal task list page
    Examples:
      | application_type | application_decision           |
      | Prior approval   | Granted                        |
      | Prior approval   | Refused                        |
      | Prior approval   | I have Not Received a Decision |

  Scenario Outline: AC04 - Verify full eligibility journey for '<application_type>' and '<application_decision>' and data persistence
    Given appellant selects local planning department
    When appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for local planning department
    When appellant clicks on the continue button
    And appellant selects the planning application type as 'Removal or variation of conditions'
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for '<application_type>' planning application type
    And appellant clicks on the continue button
    When appellant selects the option no for 'Are the conditions for householder planning permission?'
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for option no for 'Are the conditions for householder planning permission?'
    And appellant clicks on the continue button
    And appellant selects 'None of these' from the list of options
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for 'None of these' from the list of options
    When appellant clicks on the continue button
    And appellant selects the '<application_decision>'
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for '<application_decision>'
    When appellant clicks on the continue button
    And appellant enters the date within 6 months when the '<application_decision>' was received
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for the date when the '<application_decision>' was received
    When appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    And appellant clicks on browser back
    Then data is persisted for enforcement notice
    When appellant clicks on the continue button
    Then appellant is navigated to full appeal task list page
    Examples:
      | application_type                   | application_decision           |
      | Removal or variation of conditions | Granted                        |
      | Removal or variation of conditions | Refused                        |
      | Removal or variation of conditions | I have Not Received a Decision |

  Scenario Outline: AC05 - Verify eligibility journey from <application_type> and Householder
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant selects '<application_type>' planning application type
    And appellant clicks on the continue button
    And appellant selects 'None of these' from the list of options
    And appellant clicks on the continue button
    And appellant selects the '<application_decision>'
    And appellant clicks on the continue button
    And appellant enters the date within 12 weeks when the '<application_decision>' was received
    And appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    Then appellant is navigated to full appeal task list page
    When appellant clicks on browser back
    And data is persisted for enforcement notice
    And appellant clicks on back link
    And data is persisted for the date when the '<application_decision>' was received
    And appellant clicks on back link
    And data is persisted for '<application_decision>'
    And appellant clicks on back link
    And data is persisted for 'None of these' from the list of options
    And appellant clicks on back link
    And data is persisted for '<application_type>' planning application type
    When appellant selects 'Householder' planning application type
    And appellant clicks on the continue button
    And appellant selects the option as No for listed building
    And appellant clicks on the continue button
    And appellant selects the 'Refused'
    And appellant clicks on the continue button
    And appellant enters the date within 12 weeks when the Refused decision was received
    And appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    And appellant selects No from the claiming costs option
    And appellant clicks on the continue button
    Then appellant is navigated to householder appeal task list page
    Examples:
      | application_type | application_decision           |
      | Full planning    | Granted                        |
      | Outline planning | Granted                        |
      | Reserved matters | Granted                        |
      | Full planning    | Refused                        |
      | Outline planning | Refused                        |
      | Reserved matters | Refused                        |
      | Full planning    | I have Not Received a Decision |
      | Outline planning | I have Not Received a Decision |
      | Reserved matters | I have Not Received a Decision |


  Scenario Outline: AC06 - Verify eligibility journey from <application_type> and Householder
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant selects '<application_type>' planning application type
    And appellant clicks on the continue button
    And appellant selects 'None of these' from the list of options
    And appellant clicks on the continue button
    And appellant selects the '<application_decision>'
    And appellant clicks on the continue button
    And appellant enters the date within 12 weeks when the '<application_decision>' was received
    And appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    Then appellant is navigated to full appeal task list page
    When appellant clicks on browser back
    And data is persisted for enforcement notice
    And appellant clicks on back link
    And data is persisted for the date when the '<application_decision>' was received
    And appellant clicks on back link
    And data is persisted for '<application_decision>'
    And appellant clicks on back link
    And data is persisted for 'None of these' from the list of options
    And appellant clicks on back link
    Then data is persisted for option no for prior approval existing house
    And appellant clicks on back link
    And data is persisted for '<application_type>' planning application type
    When appellant selects 'Householder' planning application type
    And appellant clicks on the continue button
    And appellant selects the option as No for listed building
    And appellant clicks on the continue button
    And appellant selects the 'Refused'
    And appellant clicks on the continue button
    And appellant enters the date within 12 weeks when the Refused decision was received
    And appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    And appellant selects No from the claiming costs option
    And appellant clicks on the continue button
    Then appellant is navigated to householder appeal task list page
    Examples:
      | application_type                   | application_decision           |
      | Prior approval                     | Granted                        |
      | Prior approval                     | Refused                        |
      | Prior approval                     | I have Not Received a Decision |

  Scenario Outline: AC07 - Verify eligibility journey from <application_type> and Householder
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant selects '<application_type>' planning application type
    And appellant clicks on the continue button
    And appellant selects 'None of these' from the list of options
    And appellant clicks on the continue button
    And appellant selects the '<application_decision>'
    And appellant clicks on the continue button
    And appellant enters the date within 12 weeks when the '<application_decision>' was received
    And appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    Then appellant is navigated to full appeal task list page
    When appellant clicks on browser back
    And data is persisted for enforcement notice
    And appellant clicks on back link
    And data is persisted for the date when the '<application_decision>' was received
    And appellant clicks on back link
    And data is persisted for '<application_decision>'
    And appellant clicks on back link
    And data is persisted for 'None of these' from the list of options
    And appellant clicks on back link
    Then data is persisted for option no for 'Are the conditions for householder planning permission?'
    And appellant clicks on back link
    And data is persisted for '<application_type>' planning application type
    When appellant selects 'Householder' planning application type
    And appellant clicks on the continue button
    And appellant selects the option as No for listed building
    And appellant clicks on the continue button
    And appellant selects the 'Refused'
    And appellant clicks on the continue button
    And appellant enters the date within 12 weeks when the Refused decision was received
    And appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    And appellant selects No from the claiming costs option
    And appellant clicks on the continue button
    Then appellant is navigated to householder appeal task list page
    Examples:
      | application_type                   | application_decision           |
      | Removal or variation of conditions | Granted                        |
      | Removal or variation of conditions | Refused                        |
      | Removal or variation of conditions | I have Not Received a Decision |



