@smoketest
Feature: A user provides their details
  The user is required to provide a valid name and email to complete an appeal.

  Scenario Outline: Valid name and email provided
    When the user provides their valid <name> and <email>
    Then the appeal's Your Details task is completed with <name> and <email>
    Examples:
      | name         | email                 |
      | "Good"       | "abc@mail.com"        |
      | "Good Name"  | "abc.def@mail.fr"     |
      | "Good-Name"  | "abc_def@mail.com"    |
      | "Also' Good" | "abc.def2@mail.com"   |

  Scenario Outline: Invalid email provided
    When the user provides the email <invalid email>
    Then the user is informed that the provided email is invalid
    Examples:
       | invalid email                |
       | "abc-@mail.com"              |
       | "abc..def@mail.com"          |
       | ".abc@mail.com"              |
       | "abc#def@mail.com"           |
       | "abc=@mail.com"              |
       | "abc@mail.c"                 |
       | "abc.def@mail#archive.com"   |
       | "abc#def@mail"               |
       | "abc#def@mail..com"          |


  Scenario Outline: Invalid name provided
    When the user provides the name <invalid name>
    Then the user is informed that the provided name is invalid
    Examples:
      | invalid name          |
      | "(Bad Name"           |
      | "Bad Name 2"          |
      | "Bad^Name"            |
      | "bad@name.com"        |

  Scenario: Email detail is missing
    When the user provides only a name
    Then the user is informed that the email is missing

  Scenario: Name detail is missing
    When the user provides only an email
    Then the user is informed that the name is missing
