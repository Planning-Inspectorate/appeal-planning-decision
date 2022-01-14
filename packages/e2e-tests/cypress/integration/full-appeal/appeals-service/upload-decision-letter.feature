Feature: As an appellant/agent
  I want to add a copy of the LPA Decision Letter
  So that the planning Inspectorate can have the necessary evidence to support my appeal

  Scenario: 1. Navigate from 'Design and Access Statement page' to 'Decision Letter' page
    Given an appellant is on the 'Design and access statement' page
    When they have uploaded a file and select 'continue'
    Then the 'Decision Letter' page is displayed

  Scenario Outline: 2. Appellant/agent uploads valid file using File Upload
    Given an appellant is on the 'Decision Letter' page
    When they upload a file '<filename>' and click on Continue button
    Then 'Task list' page is displayed
    When an appellant is on the 'Decision Letter' page
    Then the uploaded file '<filename>' is displayed
    Examples:
      | filename               |
      | upload-file-valid.doc  |
      | upload-file-valid.docx |
      | upload-file-valid.jpeg |
      | upload-file-valid.jpg  |
      | upload-file-valid.png  |
      | upload-file-valid.tif  |
      | upload-file-valid.tiff |
      | upload-file-valid.pdf  |

  Scenario: 3. Appellant/agent uploads valid file using Drag and Drop
    Given an appellant is on the 'Decision Letter' page
    When they drag and drop a file and click on Continue button
    Then 'Task list' page is displayed

  Scenario Outline: 4. Appellant uploads a large file and an invalid file
    Given an appellant has uploaded a file '<filename>'
    When they select the 'Continue' button
    Then an error message '<error message>' is displayed
    Examples:
      | filename                                | error message                                                                     |
      | upload_file_large.tiff                  | upload_file_large.tiff must be smaller than 15MB                                  |
      | appeal-statement-invalid-wrong-type.mp3 | appeal-statement-invalid-wrong-type.mp3 must be a DOC, DOCX, PDF, TIF, JPG or PNG |
      | appeal-statement-invalid-wrong-type.csv | appeal-statement-invalid-wrong-type.csv must be a DOC, DOCX, PDF, TIF, JPG or PNG |

  Scenario: 5. Appellant does not upload any document
    Given an appellant has not uploaded any document
    When they select the 'Continue' button
    Then an error message 'Select your decision letter' is displayed

  Scenario: 6. Navigate from 'Decision Letter' page back to Task List
    Given an appellant is on the 'Decision Letter' page
    When they click on the 'Back' link
    Then they are presented with the 'Appeal a planning decision' task list page
    #And the last task they are working on will show ‘In progress’
