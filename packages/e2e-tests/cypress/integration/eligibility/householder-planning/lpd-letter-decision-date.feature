@e2e
Feature: Date Decision received eligibility check for householder appeal
  Appellant must enter the decision date mentioned on Local planning decision letter

  Scenario Outline: AC01 - Eligible Date Decision Received allows progress for householder appeal
    Given appellant navigates to decision date received page for householder appeal
    And appellant selects the '<application_decision>'
    And appellant is on the what date was the decision received page for '<application_decision>'
    When appellant enters the date lesser than the deadline date for '<application_decision>'
    And appellant clicks on continue
    Then appellant is navigated to the have you received an enforcement notice page
    Examples:
      | application_decision |
      | Granted              |
      | Refused              |

  Scenario Outline: AC02 - Ineligible  Date Decision Received continues to Shutter page for householder appeal
    Given appellant navigates to decision date received page for householder appeal
    And appellant selects the '<application_decision>'
    And appellant is on the what date was the decision received page for '<application_decision>'
    When appellant enters the date older than the deadline date for '<application_decision>'
    And appellant clicks on continue
    Then appellant gets routed to a page which notifies them that the decision appeal date has passed
    Examples:
      | application_decision |
      | Granted              |
      | Refused              |

  Scenario Outline: AC03 - Future Date Decision is Refused for Householder planning
    Given appellant navigates to decision date received page for householder appeal
    And appellant selects the '<application_decision>'
    And appellant is on the what date was the decision received page for '<application_decision>'
    When appellant enters future date decision received of '<datePart>'-'<value>' for '<application_decision>'
    And appellant clicks on continue
    Then progress is halted with an error: 'Decision date must be today or in the past' for '<application_decision>'
    And the correct input 'day,month,year' is highlighted for '<application_decision>'
    Examples: Full Planning
      | application_decision | datePart | value |
      | Granted              | day      | 10    |
      | Granted              | month    | 10    |
      | Granted              | year     | 2     |
      | Refused              | day      | 10    |
      | Refused              | month    | 10    |
      | Refused              | year     | 2     |


  Scenario Outline: AC04 - Invalid Date Decision Received of <day>-<month>-<year> is Refused
    Given appellant navigates to decision date received page for householder appeal
    And appellant selects the 'Granted'
    And appellant is on the what date was the decision received page for 'Granted'
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

  Scenario Outline: AC05 - Entered date not retained if Back Link clicked for householder appeal
    Given appellant navigates to decision date received page for householder appeal
    And appellant selects the '<application_decision>'
    And appellant is on the what date was the decision received page for '<application_decision>'
    When appellant enters date decision received of '25'-'10'-'2022' for '<application_decision>'
    And appellant clicks the back button
    Then appellant is navigated to the granted or refused page for '<application_decision>'
    And decision received date they have inputted will not be saved for '<application_decision>'
    Examples:
      | application_decision |
      | Granted              |
      | Refused              |
