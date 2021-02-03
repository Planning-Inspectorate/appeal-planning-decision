@wip
Feature: Decision Date eligibility check
  Note: A valid appeal must be submitted within 12 weeks after the original Decision Date.

  Scenario: Eligible Decision Date allows progress
    Given a Decision Date is requested
    When an eligible Decision Date is provided
    Then progress is made to the Local Planning Department eligibility question

  Scenario: Ineligible Decision Date prevents progress
    Given a Decision Date is requested
    When an ineligible Decision Date is provided
    Then progress is halted with a message that the Decision Date is ineligible because it is beyond the deadline for an appeal

  Scenario: Absence of Decision Date prevents progress
    Given a Decision Date is requested
    When absence of Decision Date is confirmed
    Then progress is halted with a message that a Decision Date is required

  Scenario Outline: Invalid Decision Dates are rejected
    Given a Decision Date is requested
    When an invalid Decision Date of <day>-<month>-<year> is provided
    Then progress is halted with a message that the provided Decision Date is invalid

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
