@smoketest
Feature: Prospective appellant provides their name and email after having provided these previously

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
    And the user can see that their appeal has not been updated with new values

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
    And the user can see that their appeal has not been updated with new values

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

  Scenario Outline: Previously submitted Your Details - Invalid name and invalid email provided
    Given the user "has" previously provided their name or email
    When the user provides their <name> and <email>
    And the user is informed that the provided value <name> is invalid because <name-reason>
    And the user is informed that the provided value <email> is invalid because <email-reason>
    And the user can see that their appeal has not been updated with new values
    Examples:
      | name                                            | email           | name-reason                       | email-reason    |
      | ""                                              | ""              | "name missing"                    | "email missing" |
      | "A"                                             | "invalid email" | "name outside size constraints"   | "email invalid" |
      | "Invalid name with prohibited characters *3(/+" | ""              | "name with prohibited characters" | "email missing" |
