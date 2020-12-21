@smoketest
Feature: Prospective appellant provides name of original applicant when acting on their behalf

  Scenario: Original applicant not acting on behalf of another applicant
    Given the user has confirmed that they "are" the original applicant
    When the user provides their "Valid Name" and "valid@email.com"
    Then the user can see that their appeal has been updated with "Valid Name" and "valid@email.com"
    And the Your Details section is "completed"

  Scenario: Acting on behalf of another applicant and provides a valid name for original applicant
    Given the user has provided valid name and email after indicating that they are are applying on behalf of another applicant
    When the user provides the name of the original applicant "Original Applicant"
    Then the user can see that their appeal "has" been updated to show that they are acting on behalf of "Original Applicant"
    And the Your Details section is "completed"

  Scenario Outline: Acting on behalf of another applicant and provides an invalid name for original applicant
    Given the user has provided valid name and email after indicating that they are are applying on behalf of another applicant
    When the user provides the name of the original applicant <original applicant>
    Then the user is informed that the provided original applicant value <original applicant> is invalid because <reason>
    And the user can see that their appeal "has not" been updated to show that they are acting on behalf of <original applicant>
    And the Your Details section is "in progress"
    Examples:
      | original applicant                                                                  | reason                            |
      | ""                                                                                  | "name missing"                    |
      | "A"                                                                                 | "name outside size constraints"   |
      | "Invalid name because it is eighty-one characters long  abcdefghijklmnopqrstuvwxyz" | "name outside size constraints"   |
      | "Invalid name with prohibited characters *3(/+"                                     | "name with prohibited characters" |
