Feature: appealDetailsSidebar:
  As an LPA user I want to know which planning application I am responding on
  so that I provide the correct information to the Planning Inspectorate.

  The user should be able to see the following data relating to the appeal:

  Planning application number
  Site address
  Apellant Name

  Scenario Outline: AC1-Appeal details sidebar is displayed with the correct information
    Given A subsection page is presented with id of <id>
    Then The appeal details sidebar is displayed with the heading "Planning application number", "Site address", and "Appellant Name"
    And The <application-number>, <address>, and <apellant-name> is displayed
    Examples:
      | id                                     | application-number   | address                                                 | apellant-name   |
      | "89aa8504-773c-42be-bb68-029716ad9756" | "ABC/123"            | "999 Letsby Avenue, Sheffield, South Yorkshire, S9 1XY" | "Bob Smith"     |

  Scenario Outline: Appeal details sidebar not shown if invalid ID is provided
    Given A subsection page is presented with id of <id>
    Then The appeal sidebar is not displayed
    Examples:
      | id                                     |
      | " "                                    |
      | "invalidId"                            |
      | "89aa8504 773c 42be bb68 029716ad9756" |
      | "89aa8504/773c/42be/bb68/029716ad9756" |
