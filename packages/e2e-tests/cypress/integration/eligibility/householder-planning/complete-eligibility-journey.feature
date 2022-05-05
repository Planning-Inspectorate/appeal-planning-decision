Feature: Householder appeal Eligibility Journey

  Scenario Outline: AC01 - Verify '<application_type>' eligibility journey for '<application_decision>'
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant selects '<application_type>' planning application type
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
    Then appellant is navigated to householder check your answers page
    Examples:
      | application_type                   | application_decision | deadline_duration |
      | Householder                        | Refused              | 12 weeks          |
      | Prior approval                     | Refused              | 12 weeks          |
      | Removal or variation of conditions | Refused              | 12 weeks          |

  Scenario Outline: AC02 - Verify '<application_type>' eligibility journey for '<application_decision>' and data persistence
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for local planning department
    When appellant clicks on the continue button
    And appellant selects '<application_type>' planning application type
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for '<application_type>' planning application type
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
      | application_type | application_decision | deadline_duration |
      | Householder      | Refused              | 12 weeks          |

  Scenario Outline: AC03 - Verify '<application_type>' eligibility journey for '<application_decision>' and data persistence
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for local planning department
    When appellant clicks on the continue button
    And appellant selects '<application_type>' planning application type
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for '<application_type>' planning application type
    When appellant clicks on the continue button
    When appellant selects the option yes for prior approval existing house
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for option yes for prior approval existing house
    And appellant clicks on the continue button
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
      | application_type | application_decision | deadline_duration |
      | Prior approval   | Refused              | 12 weeks          |

  Scenario Outline: AC04 - Verify '<application_type>' eligibility journey for '<application_decision>' and data persistence
    Given appellant selects local planning department
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for local planning department
    When appellant clicks on the continue button
    And appellant selects '<application_type>' planning application type
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for '<application_type>' planning application type
    When appellant clicks on the continue button
    When appellant selects the option yes for 'Are the conditions for householder planning permission?'
    And appellant clicks on the continue button
    And appellant clicks on back link
    Then data is persisted for option yes for 'Are the conditions for householder planning permission?'
    And appellant clicks on the continue button
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
      | application_type                   | application_decision | deadline_duration |
      | Removal or variation of conditions | Refused              | 12 weeks          |

  Scenario Outline: AC05 - Verify eligibility journey from Householder to <application_type>
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
    Then appellant is navigated to full appeal check your answers page
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

  Scenario Outline: AC06 - Verify eligibility journey from Householder to <application_type> for <application_decision>
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
    And appellant selects the option as No for listed building
    And appellant clicks on the continue button
    And appellant selects the '<application_decision>' for '<application_type>'
    And appellant clicks on the continue button
    And appellant enters the date within 6 months when the '<application_decision>' was received
    And appellant clicks on the continue button
    And appellant selects No from the enforcement notice options
    And appellant clicks on the continue button
    Then appellant is navigated to full appeal task list page
    Examples:
      | application_type | application_decision           |
      | Prior approval   | Granted                        |
      | Prior approval   | I have Not Received a Decision |

  Scenario Outline: AC07 - Verify eligibility journey from Householder to <application_type> for <application_decision>
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
    And appellant selects the option as No for listed building
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
      | Removal or variation of conditions | Granted                        |
      | Removal or variation of conditions | I have Not Received a Decision |
