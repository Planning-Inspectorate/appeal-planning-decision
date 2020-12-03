@wip
Feature: Your Details status

    Scenario Outline: The status of the Your Details section is accurate
        Given the user has provided their name: <name> and email: <email>
        And the user has stated that they "are" the original appellant
        When the user checks the status of their appeal
        Then the user should see that the Your Details section is <status>

        Examples:
            | name        | email            | Status        |
            | ""          | ""               | "Not Started" |
            | ""          | "good@email.com" | "Not Started" |
            | "Good Name" | ""               | "Not Started" |
            | "Good Name" | "good@email.com" | "Completed"   |


      Scenario Outline: The status of the Your Details section is accurate
          Given the user has provided their name: <name> and email: <email>
          And the user has stated that they "are not" the original appellant
          And the user has provided <on behalf of> as the name of the original appellant
          When the user checks the status of their appeal
          Then the user should see that Your Details section is <status>

          Examples:
              | name                | email            | on behalf of    | Status        |
              | "Another Good Name" | "good@email.com" | ""              | "In Progress" |
              | "Another Good Name" | "good@email.com" | "Good Name"     | "Completed"   |
