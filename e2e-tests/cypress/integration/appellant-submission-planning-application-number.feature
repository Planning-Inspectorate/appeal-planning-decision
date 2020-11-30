@wip
Feature: Appellant submits a planning application reference number so that the planning inspectorate can refer to their appeal

  Scenario Outline: Prospective appellant provides a valid planning application number
    When the user provides a planning application number <valid application number>
    Then the appeal is updated with the provided planning application number

      Examples:
          | valid application number |
          | "P20/21076/NMA"          |
          | "2020/1660/01/TCA"       |
          | "118924/JO/2018"         |
          | "P/3423/20"              |

  Scenario Outline: Prospective appellant provides an invalid planning application number
    When the user provides a planning application number <invalid application number>
    Then the user is informed that the application number is not valid because <reason>
    And the appeal is not updated with the provided planning application number

      Examples:
          | invalid application number   | reason            |
          | ""                           | "mandatory field" |
