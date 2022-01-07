Feature: Date Decision Due eligibility check
  Note: A valid appeal must be submitted if their decision is not yet received is 6 months prior to when they are making the appeal.

  Scenario Outline: AC01 - Eligible Date Decision Due allows progress for <application_type>
    Given appellant navigates to decision date page for '<application_type>'
    And appellant is on the what date was the decision due page
    When appellant enters the date within 6 months when they were due a decision
    And appellant clicks on continue
    Then they are navigated to the have you received an enforcement notice page

    Examples:
      | application_type |
      | Full planning  |
      | Outline planning  |
      | Prior approval  |
      | Reserved matters  |
      | Removal or variation of conditions  |

  Scenario Outline: AC02 - Ineligible Date Decision Due continues to Shutter page for <application_type>
    Given appellant navigates to decision date page for '<application_type>'
    And appellant is on the what date was the decision due page
    When appellant enters a past date of over 6 months
    And appellant clicks on continue
    Then appellant gets routed to a page which notifies them that they cannot appeal

    Examples:
      | application_type |
      | Full planning  |
      | Outline planning  |
      | Prior approval  |
      | Reserved matters  |
      | Removal or variation of conditions  |

  Scenario Outline: AC03 - Future Date Decision is rejected for '<application_type>'
    Given appellant navigates to decision date page for '<application_type>'
    And appellant is on the what date was the decision due page
    When appellant enters future date decision due of '<datePart>'-'<value>'
    And appellant clicks on continue
    Then progress is halted with an error: 'The date the decision was due must be today or in the past'
    And the correct input 'day,month,year' is highlighted

    Examples: Full Planning
      | application_type | datePart | value |
      | Full planning | day | 10 |
      | Full planning | month | 10 |
      | Full planning | year | 2 |

    Examples: Outline planning
      | application_type | datePart | value |
      | Outline planning | day | 10 |
      | Outline planning | month | 10 |
      | Outline planning | year | 2 |

    Examples: Prior approval
      | application_type | datePart | value |
      | Prior approval | day | 10 |
      | Prior approval | month | 10 |
      | Prior approval | year | 2 |

    Examples: Reserved matters
      | application_type | datePart | value |
      | Reserved matters | day | 10 |
      | Reserved matters | month | 10 |
      | Reserved matters | year | 2 |

    Examples: Removal or variation of conditions
      | application_type | datePart | value |
      | Removal or variation of conditions | day | 10 |
      | Removal or variation of conditions | month | 10 |
      | Removal or variation of conditions | year | 2 |

   Scenario Outline: AC04 - Invalid Date Decision Due of <day>-<month>-<year> is rejected
    Given appellant navigates to date decision due page
    And appellant is on the what date was the decision due page
    When appellant enters date decision due of <day>-<month>-<year>
    And appellant clicks on continue
    Then progress is halted with an error: <error>
    And the correct input <highlights> is highlighted

    Examples:
      | day  | month | year   | error                                                         | highlights       |
      | ""   | ""    | ""     | "Enter the date the decision was due"                         | "day,month,year" |
      | ""   | ""    | "2022" | "The date the decision was due must include a day and month"  | "day,month"      |
      | ""   | ""    | "2021" | "The date the decision was due must include a day and month"  | "day,month"      |
      | ""   | ""    | "1000" | "The date the decision was due must include a day and month"  | "day,month"      |
      | ""   | ""    | "9999" | "The date the decision was due must include a day and month"  | "day,month"      |
      | ""   | "09"  | ""     | "The date the decision was due must include a day and year"   | "day,year"       |
      | ""   | "12"  | ""     | "The date the decision was due must include a day and year"   | "day,year"       |
      | ""   | "14"  | ""     | "The date the decision was due must be a real date"           | "day,year"       |
      | "31" | ""    | ""     | "The date the decision was due must include a month and year" | "month,year"     |
      | "1"  | ""    | ""     | "The date the decision was due must include a month and year" | "month,year"     |
      | "45" | ""    | ""     | "The date the decision was due must be a real date"           | "month,year"     |
      | ""   | "12"  | "2020" | "The date the decision was due must include a day"            | "day"            |
      | ""   | "14"  | "2025" | "The date the decision was due must be a real date"           | "day"            |
      | "31" | ""    | "2021" | "The date the decision was due must include a month"          | "month"          |
      | "45" | ""    | "3000" | "The date the decision was due must be a real date"           | "month"          |
      | "1"  | "1"   | ""     | "The date the decision was due must include a year"           | "year"           |
      | "31" | "12"  | ""     | "The date the decision was due must include a year"           | "year"           |
      | "45" | "14"  | ""     | "The date the decision was due must be a real date"           | "year"           |
      | "40" | "12"  | "2020" | "The date the decision was due must be a real date"           | "day"            |
      | "05" | "14"  | "2025" | "The date the decision was due must be a real date"           | "month"          |
      | "32" | "13"  | "2020" | "The date the decision was due must be a real date"           | "day,month"      |
      | "1a" | "0b"  | "2cde" | "The date the decision was due must be a real date"           | "day,month,year" |
      | "aa" | "10"  | "2020" | "The date the decision was due must be a real date"           | "day"            |
      | "aa" | "bb"  | "2020" | "The date the decision was due must be a real date"           | "day,month"      |
      | "31" | "zz"  | "2020" | "The date the decision was due must be a real date"           | "month"          |
      | "31" | "10"  | "aaaa" | "The date the decision was due must be a real date"           | "year"           |
      | "19" | "10"  | "20"   | "The date the decision was due must be a real date"           | "year"           |

  Scenario Outline: AC05 - Entered date not retained if Back Link clicked for '<application_type>'
    Given appellant navigates to decision date page for '<application_type>'
    And appellant is on the what date was the decision due page
    When appellant enters date decision due of '25'-'10'-'2022'
    And appellant selects the back button
    Then appellant is navigated to the granted or refused page
    And decision due date they have inputted will not be saved

    Examples:
      | application_type |
      | Full planning  |
      | Outline planning  |
      | Prior approval  |
      | Reserved matters  |
      | Removal or variation of conditions  |
