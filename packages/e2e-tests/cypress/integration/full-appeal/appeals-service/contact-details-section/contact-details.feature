@e2e
Feature: As an appellant/agent
  I want to enter my contact details
  So that all the necessary information needed for my appeal to be processed are provided

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1. Appellant - Navigate from 'Was the planning application made in your name' to 'Contact Details' page
    Given an Appellant is on the 'Provide your contact details' page
    When appellant enters their 'full name, company name, email address'
    And they select the 'Continue' button
    Then they return to the task list on the 'Appeal a planning decision' page

  Scenario: 2. Agent - Navigate from 'What is the applicant's name' to 'Contact Details' page
    Given an Agent is on the 'Provide your contact details' page
    When agent enters their 'full name, company name, email address'
    And they select the 'Continue' button
    Then they return to the task list on the 'Appeal a planning decision' page

  Scenario Outline: 3. Appellant provides invalid details
    Given the appellant is on the 'Provide your contact details' page
    When they have or have not provided '<value>' in the '<field>' text box
    And they select the 'Continue' button
    Then they are presented with the error '<reason>'
    Examples:
      | field              | value | reason                                                                 |
      | Your full name     | a     | Name must be between 2 and 80 characters                               |
      | Your full name     | 2     | Name must only include letters a to z, hyphens, spaces and apostrophes |
      | Your email address | b     | Enter an email address in the correct format, like name@example.com    |
      | Your email address | a@b   | Enter an email address in the correct format, like name@example.com    |

  Scenario Outline: 4. Agent provides invalid details
    Given the agent is on the 'Provide your contact details' page
    When they have or have not provided '<value>' in the '<field>' text box
    And they select the 'Continue' button
    Then they are presented with the error '<reason>'
    Examples:
      | field              | value | reason                                                                 |
      | Your full name     | a     | Name must be between 2 and 80 characters                               |
      | Your full name     | 2     | Name must only include letters a to z, hyphens, spaces and apostrophes |
      | Your email address | b     | Enter an email address in the correct format, like name@example.com    |
      | Your email address | a@b   | Enter an email address in the correct format, like name@example.com    |

  Scenario: 4. Agent or Appellant does not provide the applicant's name
    Given the Agent or Appellant is on the 'Provide your contact details' page
    When they have not provided the applicant's name
    And they select the 'Continue' button
    Then an error message 'Enter your full name' is displayed

  Scenario: 5. Navigate from 'Provide your contact details' page back to Task List
    Given an Appellant is on the 'Provide your contact details' page
    When they click on the 'Back' link
    Then they are presented with the 'Was the planning application made in your name?' page

  Scenario: 6. Navigate from 'Provide your contact details' page back to Task List
    Given an Agent is on the 'Provide your contact details' page
    When they click on the 'Back' link
    Then they are presented with the 'What is the applicant's name?' page
    When they click on the 'Back' link
    Then they are presented with the 'Was the planning application made in your name?' page
