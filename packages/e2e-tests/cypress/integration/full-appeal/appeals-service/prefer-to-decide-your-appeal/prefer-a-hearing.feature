Feature: As an Appellant or Agent
         I want to give reasons why I want a Hearing
         So that all the necessary details needed for my appeal to be processed are provided

  Background:
    Given appellant has completed full appeal eligibility journey

 Scenario: 1 - Navigate from 'How would you prefer us to decide your appeal' to 'Why would you prefer a hearing?' page
    Given an Appellant or Agent is on the How would you prefer us to decide your appeal for hearing
    When they select the option 'Hearing'
    Then 'Why would you prefer a hearing?' page is displayed

 Scenario: 2 - Appellant or Agent enters letters/numbers into the text box
    Given an Appellant or Agent is on the 'Why would your prefer a hearing?' page
    When they enter text into the box and click 'Continue'
    Then the page 'Upload your draft statement of common ground' page is displayed

 Scenario: 3 - No characters entered in the text box
    Given an Appellant or Agent has not provided any details
    When they click 'Continue'
    Then they are presented with an error message 'Enter why you would prefer a hearing'

 Scenario: 4 - More than 255 characters entered
    Given an appellant agent has entered more than 255 characters into the text box
    When they click 'Continue'
    Then they are presented with an error message 'Hearing information must be 255 characters or less'

 Scenario: 5 - Navigate from 'Why would you prefer a hearing' page back to 'How would you prefer us to decide your appeal?'
   Given an Appellant or Agent is on the 'Why would your prefer a hearing?' page
   When they click on the 'Back' link
   Then they are presented with the 'How would you prefer us to decide your appeal' page
