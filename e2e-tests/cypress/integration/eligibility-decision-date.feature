Feature: Decision Date eligibility check
  Note: A valid appeal must be submitted within 12 weeks after the original Decision Date.

  Scenario: Eligible Decision Date allows progress
    Given a Decision Date is requested
    When an eligible Decision Date is provided
    Then progress is made to the Local Planning Department eligibility question

  Scenario: Ineligible Decision Date continues to Decision Date Passed page and allows returning to the Decision Date page
    Given a Decision Date is requested
    When an ineligible Decision Date is provided
    And progress is halted with a message that the Decision Date is ineligible because it is beyond the deadline for an appeal
    And the re-enter the decision date link is clicked
    Then progress is made to the Decision Date question

  Scenario: Ineligible Decision Date continues to Decision Date Passed page and prevents navigating to a page other than the Decision Date page
    Given a Decision Date is requested
    When an ineligible Decision Date is provided
    And progress is halted with a message that the Decision Date is ineligible because it is beyond the deadline for an appeal
    And navigate to the Householder Planning Permission question
    Then progress is halted with a message that the Decision Date is ineligible because it is beyond the deadline for an appeal

  @as-1666
  Scenario Outline: Invalid Decision Date of <day>-<month>-<year> is rejected
    Given a Decision Date is requested
    When a Decision Date of <day>-<month>-<year> is provided
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
      | "45" | ""    | ""     | "The Decision Date must include a month and year" | "month,year"     |
      | ""   | "12"  | "2020" | "The Decision Date must include a day"            | "day"            |
      | ""   | "14"  | "2025" | "The Decision Date must include a day"            | "day"            |
      | "31" | ""    | "2021" | "The Decision Date must include a month"          | "month"          |
      | "45" | ""    | "3000" | "The Decision Date must include a month"          | "month"          |
      | "1"  | "1"   | ""     | "The Decision Date must include a year"           | "year"           |
      | "31" | "12"  | ""     | "The Decision Date must include a year"           | "year"           |
      | "45" | "14"  | ""     | "The Decision Date must include a year"           | "year"           |
      | "40" | "12"  | "2020" | "The Decision Date must be a real date"           | "day"            |
      | "05" | "14"  | "2025" | "The Decision Date must be a real date"           | "month"          |
      | "1"  | "5"   | "2027" | "Decision date must be today or in the past"           | "day,month,year" |
      | "1"  | "1"   | "2022" | "Decision date must be today or in the past"           | "day,month,year" |
      | "32" | "13"  | "2020" | "The Decision Date must be a real date"           | "day,month"      |
      | "1a" | "0b"  | "2cde" | "The Decision Date must be a real date"           | "day,month,year" |
      | "aa" | "10"  | "2020" | "The Decision Date must be a real date"           | "day"            |
      | "aa" | "bb"  | "2020" | "The Decision Date must be a real date"           | "day,month"      |
      | "31" | "zz"  | "2020" | "The Decision Date must be a real date"           | "month"          |
      | "31" | "10"  | "aaaa" | "The Decision Date must be a real date"           | "year"           |
      | "19" | "10"  | "20"   | "The Decision Date must be a real date"           | "year"           |
