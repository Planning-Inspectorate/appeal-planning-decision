Feature: Your Details task status

  Scenario: The status of the Your Details section is accurate
    Given the user has not been in "Your Details" section
    When the user checks the status of their appeal
    Then the user should see that the "Your Details" task is "NOT STARTED"

  Scenario Outline: The status of the Your Details section is accurate
    Given the user "is" the original appellant
    And the user has provided their name: <name> and email: <email>
    When the user checks the status of their appeal
    Then the user should see that the "Your Details" task is <status>

    Examples:
      | name        | email            | status        |
      | ""          | ""               | "IN PROGRESS" |
      | ""          | "good@email.com" | "IN PROGRESS" |
      | "Good Name" | ""               | "IN PROGRESS" |
      | "Good Name" | "good@email.com" | "COMPLETED"   |


  Scenario Outline: The status of the Your Details section is accurate
    Given the user "is not" the original appellant
    And the user has provided their name: <name> and email: <email>
    And the user has provided <on behalf of> as the name of the original appellant
    When the user checks the status of their appeal
    Then the user should see that the "Your Details" task is <status>

    Examples:
      | name                | email            | on behalf of | status        |
      | "Another Good Name" | "good@email.com" | ""           | "IN PROGRESS" |
      | "Another Good Name" | "good@email.com" | "Good Name"  | "COMPLETED"   |
