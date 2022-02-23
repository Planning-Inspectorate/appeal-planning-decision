Feature:  As an Appellant or Agent
          I want to give an estimate for the inquiry duration
          So that the Planning Inspectorate can take this into account when deciding the event duration

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'Why would you prefer an inquiry' to 'How many date would you expect the inquiry to last?' page
    Given an Appellant or Agent is on the 'Why would you prefer an inquiry?'
    When they enter text in text box and click 'Continue'
    Then 'How many date would you expect the inquiry to last?' page is displayed

  Scenario: 2 - Appellant or Agent enters numbers into the text box
    Given an Appellant or Agent is on the 'How many days would you expect the inquiry to last?' page
    When they enter number of days into the box and click 'Continue'
    Then the page 'Upload your draft statement of common ground' page is displayed

  Scenario Outline: 4 - Enter character, not a whole number, higher than 999 and lower than 999
    Given an Appellant or Agent has entered a '<value>' for the '<expectedUserInput>'
    When they click 'Continue'
    Then they are presented with an error message '<errorMessage>' in the expect inquiry last page
    Examples:
      | expectedUserInput                 | value | errorMessage                                                                           |
      | not provided any details          |       | Enter how many days you would expect the inquiry to last                               |
      | a character which is not a number | abcd  | The days you would expect the inquiry to last must be a whole number between 1 and 999 |
      | not a whole number                | 1.5   | The days you would expect the inquiry to last must be a whole number between 1 and 999 |
      | higher than 999                   | 1000  | The days you would expect the inquiry to last must be a whole number between 1 and 999 |
      | lower than 1                      | 0     | The days you would expect the inquiry to last must be a whole number between 1 and 999 |

  Scenario: 5 - Navigate from 'How many days would you expect the inquiry to last?' page back to 'Why would you prefer an inquiry?'
    Given an Appellant or Agent is on the 'How many days would you expect the inquiry to last?' page
    When they click on the 'Back' link
    Then they are presented with the 'Why would you prefer an inquiry?' page
    And they can see the text entered
