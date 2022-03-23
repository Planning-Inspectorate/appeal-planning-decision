@wip @has
Feature: Name and email provided after being previously provided
  Note: This feature describes behaviour for a newly created appeal

  Scenario: Section status update - original applicant - valid name and email
    Given name and email are requested again where appellant is the original applicant
    When new valid name and email are submitted
    Then Your Details section is "COMPLETED"

  Scenario: Section status update - original applicant - invalid name and email
    Given name and email are requested again where appellant is the original applicant
    When new invalid name and email are submitted
    Then Your Details section is "COMPLETED"

  Scenario: Section status update - not original applicant - valid name and email
    Given name and email are requested again where appellant is not the original applicant
    When new valid name and email are submitted
    Then Your Details section is "IN PROGRESS"

  Scenario: Section status update - not original applicant - invalid name and email
    Given name and email are requested again where appellant is not the original applicant
    When new invalid name and email are submitted
    Then Your Details section is "IN PROGRESS"

  Scenario Outline: Valid name and email - original applicant
    Given name and email are requested again where appellant is the original applicant
    When <name> and <email> are submitted
    Then appeal tasks are presented
    And appeal is updated with <name> and <email>
    Examples:
      | name                                                                               | email               |
      | "Good"                                                                             | "abc@mail.com"      |
      | "Good Name"                                                                        | "abc.def@mail.fr"   |
      | "Good-Name"                                                                        | "abc_def@mail.com"  |
      | "Also' Good"                                                                       | "abc.def2@mail.com" |
      | "Valid name because it is eighty characters long ----- abcdefghijklmnopqrstuvwxyz" | "abc.def2@mail.com" |

  Scenario: Valid name and email - not original applicant
    Given name and email are requested again where appellant is not the original applicant
    And confirmation provided that appellant is not original applicant
    When new valid name and email are submitted
    Then applicant name is presented
    And appeal is updated with new valid name and email

  @as-1673
  Scenario Outline: Invalid name and valid email
    Given name and email are requested again
    When <name> and <email> are submitted
    Then name <name> is invalid because <reason>
    And name and email are presented
    And appeal is not updated again
    Examples:
      | name                                                                                | email             | reason                            |
      | ""                                                                                  | "valid@email.com" | "name missing"                    |
      | "A"                                                                                 | "valid@email.com" | "name outside size constraints"   |
      | "Invalid name because it is eighty-one characters long  abcdefghijklmnopqrstuvwxyz" | "valid@email.com" | "name outside size constraints"   |
      | "Invalid name with prohibited characters *3(/+"                                     | "valid@email.com" | "name with prohibited characters" |

  Scenario Outline: Valid name and invalid email
    Given name and email are requested again
    When <name> and <email> are submitted
    Then email <email> is invalid because <reason>
    And name and email are presented
    And appeal is not updated again
    Examples:
      | name         | email                      | reason          |
      | "Valid Name" | ""                         | "email missing" |
      | "Valid Name" | "invalid email"            | "email invalid" |
      | "Valid Name" | "abc-@mail.com"            | "email invalid" |
      | "Valid Name" | "abc..def@mail.com"        | "email invalid" |
      | "Valid Name" | ".abc@mail.com"            | "email invalid" |
      | "Valid Name" | "abc#def@mail.com"         | "email invalid" |
      | "Valid Name" | "abc=@mail.com"            | "email invalid" |
      | "Valid Name" | "abc@mail.c"               | "email invalid" |
      | "Valid Name" | "abc.def@mail#archive.com" | "email invalid" |
      | "Valid Name" | "abc#def@mail"             | "email invalid" |
      | "Valid Name" | "abc#def@mail..com"        | "email invalid" |

  Scenario Outline: Invalid name and invalid email
    Given name and email are requested again
    When <name> and <email> are submitted
    Then name <name> is invalid because <name-reason>
    And email <email> is invalid because <email-reason>
    And name and email are presented
    And appeal is not updated again
    Examples:
      | name                                            | email           | name-reason                       | email-reason    |
      | ""                                              | ""              | "name missing"                    | "email missing" |
      | "A"                                             | "invalid email" | "name outside size constraints"   | "email invalid" |
      | "Invalid name with prohibited characters *3(/+" | ""              | "name with prohibited characters" | "email missing" |
