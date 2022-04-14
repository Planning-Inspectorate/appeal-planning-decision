@e2e
Feature: As an appellant/agent
         I want to add a copy of my draft statement of common ground for Hearing or Inquiry
         So that the planning Inspectorate can have the necessary evidence to support my appeal

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'Why would you prefer a hearing?' to 'Upload your draft statement of common ground' page
    Given the Appellant or Agent is on the 'Why would you prefer a hearing' page
    When they have entered text in the 'text box' and click 'Continue' for Hearing
    Then the 'Upload your draft statement of common ground' page is displayed

  Scenario: 2 - Navigate from 'How many days would you expect the inquiry to last?' to 'Upload your draft statement of common ground' page
    Given the Appellant or Agent is on the 'How many days would you expect the inquiry to last?' page
    When they have entered text in the 'text box' and click 'Continue' for Inquiry
    Then the 'Upload your draft statement of common ground' page is displayed

  Scenario Outline: 3 - Appellant/agent uploads valid file for '<decideAppeal>' options
    Given the Appellant or Agent is on the 'Upload your draft statement of common ground' page for '<decideAppeal>'
    When they add valid files through 'Choose files' or 'drag and drop' and click 'Continue'
    Then they are returned to the task list
    When they click on the browser back button for the journey '<decideAppeal>'
    Then they are on the 'Upload your draft statement of common ground' page for '<decideAppeal>' and can see the uploaded file
    When they click on the 'Back' link then they are on the relevant '<page>'
    Then they can see the previously entered text for '<decideAppeal>'
    #And the status against task 'Tell us how you would prefer us to decide your appeal' will show as completed
  Examples:
    | decideAppeal | page                                               |
    | Hearing      | Why would you prefer a hearing                     |
    | Inquiry      | How many days would you expect the inquiry to last |

  Scenario Outline: 4. Appellant or Agent uploads a '<filetype>' for Hearing
    Given the Appellant or Agent has uploaded '<filetype>' as '<filename>' in the 'Upload your draft statement of common ground' page
    When they click on 'Continue' button
    Then the file '<filename>' '<errormessage>' is displayed
    Examples:
      | filetype     | filename                                | errormessage                                 |
      | large file   | upload-file-valid-15mb.png              | must be smaller than 15MB                    |
      | invalid file | appeal-statement-invalid-wrong-type.mp3 | must be a DOC, DOCX, PDF, TIF, JPG or PNG    |
      | invalid file | appeal-statement-invalid-wrong-type.csv | must be a DOC, DOCX, PDF, TIF, JPG or PNG    |
      | no file      |                                         | Select your draft statement of common ground |

