Feature: A user supplies a Decision Date for the case they wish to appeal
    I need to provide the date of the decision from the local planning department,
    so that the system can confirm whether my appeal is in time.

  Scenario: Eligibility Decision Dates less than 12 weeks old can proceed
    When I provide a decision date that is less than 12 weeks old
    Then I can proceed with the provided decision date

  Scenario: Eligibility Decision Dates older than 12 weeks cannot proceed
    When I provide a decision date that is more than 12 weeks old
    Then I am informed that the provided decision date is beyond the deadline for appeal

  Scenario Outline: invalid Decision Dates are rejected
    When I provide a decision date of <day> / <month> / <year>
    Then I am informed that the provided Decision Date is invalid

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
