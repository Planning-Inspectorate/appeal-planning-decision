Feature: Check that decision date is valid and eligible to commence an appeal with ACP integration
  Note - This feature is intended to support redirection to ACP service as part of initial MVP

  Scenario: (1) Decision date less than 12 weeks old can proceed
    Given the application decision date is requested
    When a decision date is provided that is no more than 12 weeks old
    Then the appeal can be commenced

  Scenario: (2) Decision date older than 12 weeks cannot proceed
    Given the application decision date is requested
    When a decision date is provided that is more than 12 weeks old
    Then the decision date is highlighted as beyond the deadline for appeal

  Scenario Outline: (3) Invalid decision dates are rejected
    Given the application decision date is requested
    When an invalid decision date <day>-<month>-<year> is provided
    Then the decision date is highlighted as with the error: <error>
    Examples:
      | day  | month | year   | error                                   |
      | ""   | ""    | ""     | "Enter the Decision Date"               |
      | "31" | "12"  | "2050" | "The Decision Date must be in the past" |
      | "32" | "12"  | "2020" | "The Decision Date must be a real date" |
      | "25" | "13"  | "2020" | "The Decision Date must be a real date" |
      | "32" | "13"  | "2020" | "The Decision Date must be a real date" |
      | "1a" | "0b"  | "2cde" | "The Decision Date must be a real date" |
      | "aa" | "10"  | "2020" | "The Decision Date must be a real date" |
      | "aa" | "bb"  | "2020" | "The Decision Date must be a real date" |
      | "31" | "zz"  | "2020" | "The Decision Date must be a real date" |
      | "31" | "10"  | "aaaa" | "The Decision Date must be a real date" |
      | "qq" | "rr"  | "ssss" | "The Decision Date must be a real date" |
      | "19" | "10"  | "20"   | "The Decision Date must be a real date" |
