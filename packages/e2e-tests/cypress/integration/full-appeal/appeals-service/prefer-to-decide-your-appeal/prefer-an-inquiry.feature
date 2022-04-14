@e2e
Feature: As an Appellant or Agent
         I want to give reasons why I want an Inquiry
         So that all the necessary details needed for my appeal to be processed are provided

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'How would you prefer us to decide your appeal' to 'Why would you prefer an inquiry?' page
    Given an Appellant or Agent is on the 'How would you prefer us to decide your appeal'
    When they select the option 'Inquiry'
    Then 'Why would you prefer an inquiry?' page is displayed

  Scenario: 2 - Appellant or Agent enters letters/numbers into the text box
    Given an Appellant or Agent is on the 'Why would your prefer a inquiry?' page
    When they enter text into the box and click 'Continue'
    Then the 'How many days would you expect the inquiry to last? page is displayed

  Scenario: 3 - No characters entered in the text box
    Given an Appellant or Agent has not provided any details
    When they click 'Continue'
    Then they are presented with an error message 'Enter why you would prefer an inquiry'

  Scenario: 4 - More than 255 characters entered
    Given an appellant agent has entered more than 255 characters into the text box
    When they click 'Continue'
    Then they are presented with an error message 'Inquiry information must be 255 characters or less'

  Scenario: 5 - Navigate from 'Why would you prefer an inquiry' page back to 'How would you prefer us to decide your appeal?'
    Given an Appellant or Agent is on the 'Why would your prefer a inquiry?' page
    When they click on the 'Back' link
    Then they are presented with the 'How would you prefer us to decide your appeal' page
    And the 'Inquiry' option is selected
