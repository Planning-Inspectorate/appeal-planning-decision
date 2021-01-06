@wip
Feature: Check that decision date is eligible to commence an appeal
  Note - This feature is intended to support redirection to ACP Service as part of initial MVP

  Scenario: Eligibility decision dates less than 12 weeks old can proceed
    Given the application decision date is requested
    When a decision date is provided that is less than 12 weeks old
    Then the appeal can be commenced

  Scenario: Eligibility decision dates older than 12 weeks cannot proceed
    Given the application decision date is requested
    When a decision date is provided that is more than 12 weeks old
    Then the decision date is highlighted as beyond the deadline for appeal

  Scenario Outline: Invalid decision dates are rejected
    Given the application decision date is requested
    When an invalid decision date <day>-<month>-<year> is provided
    Then the decision date is highlighted as invalid
    Examples:
      | day   | month | year   |
      | ""    | ""    | ""     |
      | "31"  | "12"  | "2050" |
      | "32"  | "12"  | "2020" |
      | "25"  | "13"  | "2020" |
      | "32"  | "13"  | "2020" |
      | "1a"  | "0b"  | "2cde" |
      | "aa"  | "10"  | "2020" |
      | "aa"  | "bb"  | "2020" |
      | "31"  | "zz"  | "2020" |
      | "31"  | "10"  | "aaaa" |
      | "qq"  | "rr"  | "ssss" |
      | "19"  | "10"  | "20"   |
