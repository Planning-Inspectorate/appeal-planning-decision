@e2e
Feature: Date Decision received eligibility check
  Appellant must enter the decision date mentioned on Local planning decision letter

  Scenario Outline: AC01 - Eligible Date Decision Received allows progress for <application_type>
    Given appellant navigates to decision date received page for '<application_type>'
    And appellant selects the '<application_decision>'
    And appellant is on the what date was the decision received page
    When appellant enters the date within 6 months when the decision was received
    And appellant clicks on continue
    Then appellant is navigated to the have you received an enforcement notice page
    Examples:
      | application_type                   | application_decision |
      | Full planning                      | Granted              |
      | Outline planning                   | Granted              |
      | Prior approval                     | Granted              |
      | Reserved matters                   | Granted              |
      | Removal or variation of conditions | Granted              |
      | Full planning                      | Refused              |
      | Outline planning                   | Refused              |
      | Prior approval                     | Refused              |
      | Reserved matters                   | Refused              |
      | Removal or variation of conditions | Refused              |

  Scenario Outline: AC02 - Ineligible  Date Decision Received continues to Shutter page for <application_type>
    Given appellant navigates to decision date received page for '<application_type>'
    And appellant selects the '<application_decision>'
    And appellant is on the what date was the decision received page
    When appellant enters the date older than 6 months when the decision was received
    And appellant clicks on continue
    Then appellant gets routed to a page which notifies them that the decision appeal date has passed
    Examples:
      | application_type                   | application_decision |
      | Full planning                      | Granted              |
      | Outline planning                   | Granted              |
      | Prior approval                     | Granted              |
      | Reserved matters                   | Granted              |
      | Removal or variation of conditions | Granted              |
      | Full planning                      | Refused              |
      | Outline planning                   | Refused              |
      | Prior approval                     | Refused              |
      | Reserved matters                   | Refused              |
      | Removal or variation of conditions | Refused              |

  Scenario Outline: AC03 - Future Date Decision is Refused for '<application_type>'
    Given appellant navigates to decision date received page for '<application_type>'
    And appellant selects the '<application_decision>'
    And appellant is on the what date was the decision received page
    When appellant enters future date decision received of '<datePart>'-'<value>'
    And appellant clicks on continue
    Then progress is halted with an error: 'Decision date must be today or in the past'
    And the correct input 'day,month,year' is highlighted
    Examples: Full Planning
      | application_type | application_decision | datePart | value |
      | Full planning    | Granted              | day      | 10    |
      | Full planning    | Granted              | month    | 10    |
      | Full planning    | Granted              | year     | 2     |
      | Full planning    | Refused              | day      | 10    |
      | Full planning    | Refused              | month    | 10    |
      | Full planning    | Refused              | year     | 2     |

    Examples: Outline planning
      | application_type | application_decision | datePart | value |
      | Outline planning | Granted              | day      | 10    |
      | Outline planning | Granted              | month    | 10    |
      | Outline planning | Granted              | year     | 2     |
      | Outline planning | Refused              | day      | 10    |
      | Outline planning | Refused              | month    | 10    |
      | Outline planning | Refused              | year     | 2     |

    Examples: Prior approval
      | application_type | application_decision | datePart | value |
      | Prior approval   | Granted              | day      | 10    |
      | Prior approval   | Granted              | month    | 10    |
      | Prior approval   | Granted              | year     | 2     |
      | Prior approval   | Refused              | day      | 10    |
      | Prior approval   | Refused              | month    | 10    |
      | Prior approval   | Refused              | year     | 2     |

    Examples: Reserved matters
      | application_type | application_decision | datePart | value |
      | Reserved matters | Granted              | day      | 10    |
      | Reserved matters | Granted              | month    | 10    |
      | Reserved matters | Granted              | year     | 2     |
      | Reserved matters | Refused              | day      | 10    |
      | Reserved matters | Refused              | month    | 10    |
      | Reserved matters | Refused              | year     | 2     |

    Examples: Removal or variation of conditions
      | application_type                   | application_decision | datePart | value |
      | Removal or variation of conditions | Granted              | day      | 10    |
      | Removal or variation of conditions | Granted              | month    | 10    |
      | Removal or variation of conditions | Granted              | year     | 2     |
      | Removal or variation of conditions | Refused              | day      | 10    |
      | Removal or variation of conditions | Refused              | month    | 10    |
      | Removal or variation of conditions | Refused              | year     | 2     |

  Scenario Outline: AC04 - Invalid Date Decision Received of <day>-<month>-<year> is Refused
    Given appellant navigates to decision date received page for 'Full planning'
    And appellant selects the 'Granted'
    And appellant is on the what date was the decision received page
    When appellant enters date decision received of <day>-<month>-<year>
    And appellant clicks on continue
    Then progress is halted with an error: <error>
    And the correct input <highlights> is highlighted

    Examples:
      | day  | month | year   | error                                             | highlights       |
      | ""   | ""    | ""     | "Enter the Decision Date"                         | "day,month,year" |
      | ""   | ""    | "2022" | "The Decision Date must include a day and month"  | "day,month"      |
      | ""   | ""    | "2021" | "The Decision Date must include a day and month"  | "day,month"      |
      | ""   | ""    | "1000" | "The Decision Date must include a day and month"  | "day,month"      |
      | ""   | ""    | "9999" | "The Decision Date must include a day and month"  | "day,month"      |
      | ""   | "09"  | ""     | "The Decision Date must include a day and year"   | "day,year"       |
      | ""   | "12"  | ""     | "The Decision Date must include a day and year"   | "day,year"       |
      | ""   | "14"  | ""     | "The Decision Date must include a day and year"   | "day,year"       |
      | "31" | ""    | ""     | "The Decision Date must include a month and year" | "month,year"     |
      | "1"  | ""    | ""     | "The Decision Date must include a month and year" | "month,year"     |
      | ""   | "12"  | "2020" | "The Decision Date must include a day"            | "day"            |
      | "31" | ""    | "2021" | "The Decision Date must include a month"          | "month"          |
      | "1"  | "1"   | ""     | "The Decision Date must include a year"           | "year"           |
      | "31" | "12"  | ""     | "The Decision Date must include a year"           | "year"           |
      | "40" | "12"  | "2020" | "The Decision Date must be a real date"           | "day"            |
      | "32" | "13"  | "2020" | "The Decision Date must be a real date"           | "day,month"      |
      | "1a" | "0b"  | "2cde" | "The Decision Date must be a real date"           | "day,month,year" |
      | "aa" | "10"  | "2020" | "The Decision Date must be a real date"           | "day"            |
      | "aa" | "bb"  | "2020" | "The Decision Date must be a real date"           | "day,month"      |
      | "31" | "zz"  | "2020" | "The Decision Date must be a real date"           | "month"          |
      | "31" | "10"  | "aaaa" | "The Decision Date must be a real date"           | "year"           |
      | "19" | "10"  | "20"   | "The Decision Date must be a real date"           | "year"           |

  Scenario Outline: AC05 - Entered date not retained if Back Link clicked for '<application_type>'
    Given appellant navigates to decision date received page for '<application_type>'
    And appellant selects the '<application_decision>'
    And appellant is on the what date was the decision received page
    When appellant enters date decision received of '25'-'10'-'2022'
    And appellant selects the back button
    Then appellant is navigated to the granted or refused page for '<application_decision>'
    And decision received date they have inputted will not be saved
    Examples:
      | application_type                   | application_decision |
      | Full planning                      | Granted              |
      | Outline planning                   | Granted              |
      | Prior approval                     | Granted              |
      | Reserved matters                   | Granted              |
      | Removal or variation of conditions | Granted              |
      | Full planning                      | Refused              |
      | Outline planning                   | Refused              |
      | Prior approval                     | Refused              |
      | Reserved matters                   | Refused              |
      | Removal or variation of conditions | Refused              |
