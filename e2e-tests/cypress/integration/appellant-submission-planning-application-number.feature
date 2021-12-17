Feature: Appellant submits a planning application reference number so that the planning inspectorate can refer to their appeal

  Scenario: Prospective appellant provides a valid planning application number
    Given user has not previously provided a planning application number
    When the user provides a planning application number "ValidNumber/12345"
    Then the planning application number in the appeal will be "ValidNumber/12345"

  Scenario Outline: Prospective appellant provides an invalid planning application number
    Given user has not previously provided a planning application number
    When the user provides a planning application number <invalid number>
    Then the user is informed that the application number is not valid because <reason>
    And the appeal is not updated with the provided planning application number

    Examples:
      | invalid number                    | reason                   |
      | ""                                | "mandatory field"        |
      | "1234567890123456789012345678901" | "exceeds max characters" |

  Scenario: Prospective appellant provides a valid planning application number that replaces previous value
    Given user has previously provided a planning application number "FirstNumber/12345"
    When the user provides a planning application number "SecondNumber/54321"
    Then the planning application number in the appeal will be "SecondNumber/54321"

  Scenario Outline: Prospective appellant provides an invalid planning application number that does not replace previous value
    Given user has previously provided a planning application number "FirstNumber/12345"
    When the user provides a planning application number <invalid number>
    Then the user is informed that the application number is not valid because <reason>
    And the planning application number in the appeal will be "FirstNumber/12345"

    Examples:
      | invalid number                    | reason                   |
      | ""                                | "mandatory field"        |
      | "1234567890123456789012345678901" | "exceeds max characters" |
