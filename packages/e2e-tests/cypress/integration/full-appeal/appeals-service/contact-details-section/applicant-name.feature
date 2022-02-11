Feature: As an Agent representing an applicant
         I want add their name
         So that the Planning Inspectorate have the accurate information

  Scenario: 1 Navigate from 'who are you' URL to 'applicant name' URL
    Given Agent is on the 'Was the original planning application made in your name?'
    When the option 'No, I'm acting on behalf of the applicant' is selected
    Then the next page to provide the Applicant's name is displayed

  Scenario: 2. Provide Applicant details
    Given an Agent is on the 'What is the applicant’s name' page
    When the Applicant’s name and Company name are provided and select 'Continue'
    Then the appellant’s details should be saved and the 'Contact details' page is displayed

  Scenario: 3. No information provided
    Given an Agent is on the 'What is the applicant’s name' page
    When they click on continue without entering any information
    Then they are presented with the error 'Enter the Applicant’s name'

  Scenario Outline: 4 - Only one letter or Numerical character entered
    Given an Agent is on the 'What is the applicant’s name' page
    When they enter '<name>' and click continue
    Then they are presented with the error '<reason>'
  Examples:
    | name | reason                                                                 |
    | 1    | Name must only include letters a to z, hyphens, spaces and apostrophes |
    | @    | Name must only include letters a to z, hyphens, spaces and apostrophes |
    | a    | Name must be between 2 and 80 characters                               |

  Scenario: 6. Agent Navigates from What is the applicants name page back to Task List
    Given an Agent is on the 'What is the applicant’s name' page
    When they click on the 'Back' link
    Then Agent is on the previous page 'Was the original planning application made in your name?'
    And they click on the 'Back' link
    Then they are presented with the 'Appeal a planning decision' task list page
   # And the last task they are working on will show 'In progress



