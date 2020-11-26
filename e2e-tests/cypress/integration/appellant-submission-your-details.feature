Feature: A user provides his details
  The user needs to give his name and his email address in order to save and continue.

  Scenario: Details are provided with a good format
    When the user provides his name and his email
    Then the user can proceed with the provided details

  Scenario: Details are provided with a bad format
    When the user provides his name and his email with a bad format
    Then the user is informed that provided details have a bad format

  Scenario: Email detail is missing
    When the user provides only his name
    Then the user is informed that the email is missing

  Scenario: Name detail is missing
    When the user provides only his email
    Then the user is informed that the name is missing
