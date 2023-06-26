@wip @has @smoketest
Feature: Name of original applicant
  Note: This feature describes behaviour for a newly created appeal

  Scenario: Valid name
    Given appeal is made on behalf of another applicant
    When original applicant name is submitted
    Then appeal tasks are presented
    And appeal is updated with the original applicant
    And Your Details section is "COMPLETED"

  Scenario Outline: Invalid name
    Given appeal is made on behalf of another applicant
    When original applicant name <original applicant> is submitted
    Then original applicant value <original applicant> is invalid because <reason>
    And applicant name is presented
    And appeal is not updated with the original applicant <original applicant>
    And Your Details section is "IN PROGRESS"
    Examples:
      | original applicant                                                                  | reason                            |
      | ""                                                                                  | "name missing"                    |
      | "A"                                                                                 | "name outside size constraints"   |
      | "Invalid name because it is eighty-one characters long  abcdefghijklmnopqrstuvwxyz" | "name outside size constraints"   |
      | "Invalid name with prohibited characters *3(/+"                                     | "name with prohibited characters" |
