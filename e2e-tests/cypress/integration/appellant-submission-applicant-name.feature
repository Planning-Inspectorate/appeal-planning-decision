@smoketest
Feature: The user gives the original appellant name
  The users needs to give the original appellant name to save and continue.

  Scenario Outline: The user provided the original appellant name and can proceed
    When the user provides the name <name>
    Then the user can proceed
    And the user can see that their appeal has "been" updated with the provided name <name>
    Examples:
      | name         |
      | "Good"       |
      | "Good Name"  |
      | "Good-Name"  |
      | "Also' Good" |

  Scenario Outline: The user provided a bad format original appellant name and cannot proceed
    When the user provides the name <invalid name>
    Then the user is informed that the provided name has a bad format
    And the user can see that their appeal has "not been" updated with the provided name <invalid name>
    Examples:
      | invalid name          |
      | "(Bad Name"           |
      | "Bad Name 2"          |
      | "Bad^Name"            |
      | "bad@name.com"        |

  Scenario: The user does not provide the original and cannot proceed
    When the user does not provides the name
    Then the user is informed that the name is missing
    And the user can see that their appeal has "not been" updated with the provided name ""


