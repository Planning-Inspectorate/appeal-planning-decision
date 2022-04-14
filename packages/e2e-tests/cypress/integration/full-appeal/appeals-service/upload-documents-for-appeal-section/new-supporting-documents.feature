@e2e
Feature: As an appellant/agent
  I want to add some supporting documents
  So that the planning Inspectorate can have the necessary evidence to support my appeal

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'Do you want to submit any new supporting documents with your appeal?' page to 'New supporting documents'
    Given an Appellant or Agent is on the 'Do you want to submit any new supporting documents with your appeal?' page
    When they select 'Yes' and click 'Continue' button
    Then the 'New supporting documents' page is displayed and the sub heading 'Drag and drop or choose files'

  Scenario: 2 - Appellant/agent uploads valid file(s)
    Given an Appellant or Agent is on the 'New supporting documents' page
    When they upload a valid file through 'Choose files' or 'drag and drop' and click 'Continue'
    Then they are returned to the task list
    #And the status has been updated to 'Complete'

  Scenario: 3 - Appellant/Agent wants to add more files
    Given an Appellant or Agent is on the 'New supporting documents' page
    And they can see the previously uploaded files and the text 'Replace the files' should be displayed
    When they upload multiple files and click 'Continue'
    Then they are returned to the task list
    When they click on browser back button
    Then the old files are replaced with the new files

  Scenario Outline: 4. Appellant or Agent uploads a large file and an invalid file
    Given an Appellant or Agent has uploaded a file '<filename>' in the 'New supporting documents' page
    When they select the 'Continue' button
    #Then an error message '<error message>' is displayed
    Then an '<error message>' is displayed for the '<filename>'
    Examples:
      | filename                                | error message                             |
      | upload-file-valid-15mb.png              | must be smaller than 15MB                 |
      | appeal-statement-invalid-wrong-type.mp3 | must be a DOC, DOCX, PDF, TIF, JPG or PNG |
      | appeal-statement-invalid-wrong-type.csv | must be a DOC, DOCX, PDF, TIF, JPG or PNG |
      |                                         | Select a supporting document              |

  Scenario Outline: 5 - Appellant/Agent uploads some valid and some invalid files
    Given an Appellant or Agent is on the 'New supporting documents' page
    When they upload one '<Valid file>' and one '<Invalid file>' through 'Choose files' or 'drag and drop' and click 'Continue'
    Then an '<error message>' is displayed for the '<Invalid file>'
    And they will have to upload any valid files again
    Examples:
      | Valid file                 | Invalid file                            | error message                             |
      | appeal-statement-valid.tif | appeal-statement-invalid-wrong-type.mp3 | must be a DOC, DOCX, PDF, TIF, JPG or PNG |

  Scenario: 6 - Navigate from 'New supporting documents' page back to 'Do you want to submit any new supporting documents with your appeal?' page
    Given an Appellant or Agent is on the 'New supporting documents' page
    When they click on the 'Back' link
    Then they are presented with the 'Do you want to submit any new supporting documents with your appeal?' page
