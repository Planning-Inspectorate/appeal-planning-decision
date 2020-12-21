@smoketest
Feature: Prospective appellant provides their details and confirms if they are acting on behalf of another applicant
  The user is required to provide a valid name and email to complete an appeal.
  The name of the original applicant is required if user is acting on their behalf.

  Scenario Outline: Not previously submitted Your Details - Valid name and email provided
    Given the user "has not" previously provided their name or email
    When the user provides their <name> and <email>
    Then the user can see that their appeal has been updated with <name> and <email>

    Examples:
      | name                                                                               | email               |
      | "Good"                                                                             | "abc@mail.com"      |
      | "Good Name"                                                                        | "abc.def@mail.fr"   |
      | "Good-Name"                                                                        | "abc_def@mail.com"  |
      | "Also' Good"                                                                       | "abc.def2@mail.com" |
      | "Valid name because it is eighty characters long ----- abcdefghijklmnopqrstuvwxyz" | "abc.def2@mail.com" |

  Scenario Outline: Not previously submitted Your Details - Invalid name and valid email provided
    Given the user "has not" previously provided their name or email
    When the user provides their <name> and <email>
    Then the user is informed that the provided value <name> is invalid because <reason>
    And the user can see that their appeal has not been updated

    Examples:
      | name                                                                                | email             | reason                            |
      | ""                                                                                  | "valid@email.com" | "name missing"                    |
      | "A"                                                                                 | "valid@email.com" | "name outside size constraints"   |
      | "Invalid name because it is eighty-one characters long  abcdefghijklmnopqrstuvwxyz" | "valid@email.com" | "name outside size constraints"   |
      | "Invalid name with prohibited characters *3(/+"                                     | "valid@email.com" | "name with prohibited characters" |

  Scenario Outline: Not previously submitted Your Details - Valid name and invalid email provided
    Given the user "has not" previously provided their name or email
    When the user provides their <name> and <email>
    Then the user is informed that the provided value <email> is invalid because <reason>
    And the user can see that their appeal has not been updated

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

  Scenario Outline: Not previously submitted Your Details - Invalid name and invalid email provided
    Given the user "has not" previously provided their name or email
    When the user provides their <name> and <email>
    And the user is informed that the provided value <name> is invalid because <name-reason>
    And the user is informed that the provided value <email> is invalid because <email-reason>
    And the user can see that their appeal has not been updated
    Examples:
      | name                                            | email           | name-reason                       | email-reason    |
      | ""                                              | ""              | "name missing"                    | "email missing" |
      | "A"                                             | "invalid email" | "name outside size constraints"   | "email invalid" |
      | "Invalid name with prohibited characters *3(/+" | ""              | "name with prohibited characters" | "email missing" |


  Scenario Outline: Previously submitted Your Details - Valid name and email provided
    Given the user "has" previously provided their name or email
    When the user provides their <name> and <email>
    Then the user can see that their appeal has been updated with <name> and <email>

    Examples:
      | name                                                                               | email               |
      | "Good"                                                                             | "abc@mail.com"      |
      | "Good Name"                                                                        | "abc.def@mail.fr"   |
      | "Good-Name"                                                                        | "abc_def@mail.com"  |
      | "Also' Good"                                                                       | "abc.def2@mail.com" |
      | "Valid name because it is eighty characters long ----- abcdefghijklmnopqrstuvwxyz" | "abc.def2@mail.com" |

  Scenario Outline: Previously submitted Your Details - Invalid name and valid email provided
    Given the user "has" previously provided their name or email
    When the user provides their <name> and <email>
    Then the user is informed that the provided value <name> is invalid because <reason>
    And the user can see that their appeal has not been updated

    Examples:
      | name                                                                                | email             | reason                            |
      | ""                                                                                  | "valid@email.com" | "name missing"                    |
      | "A"                                                                                 | "valid@email.com" | "name outside size constraints"   |
      | "Invalid name because it is eighty-one characters long  abcdefghijklmnopqrstuvwxyz" | "valid@email.com" | "name outside size constraints"   |
      | "Invalid name with prohibited characters *3(/+"                                     | "valid@email.com" | "name with prohibited characters" |

  Scenario Outline: Previously submitted Your Details - Valid name and invalid email provided
    Given the user "has" previously provided their name or email
    When the user provides their <name> and <email>
    Then the user is informed that the provided value <email> is invalid because <reason>
    And the user can see that their appeal has not been updated

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

  Scenario Outline: Previously submitted Your Details - nvalid name and invalid email provided
    Given the user "has" previously provided their name or email
    When the user provides their <name> and <email>
    And the user is informed that the provided value <name> is invalid because <name-reason>
    And the user is informed that the provided value <email> is invalid because <email-reason>
    And the user can see that their appeal has not been updated
    Examples:
      | name                                            | email           | name-reason                       | email-reason    |
      | ""                                              | ""              | "name missing"                    | "email missing" |
      | "A"                                             | "invalid email" | "name outside size constraints"   | "email invalid" |
      | "Invalid name with prohibited characters *3(/+" | ""              | "name with prohibited characters" | "email missing" |


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
