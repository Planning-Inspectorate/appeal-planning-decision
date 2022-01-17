Feature: As an appellant/agent
         I want to add a copy of my appeal statement
         So that the planning Inspectorate can have the necessary evidence to support my appeal

  Scenario: 1. Navigate from 'Appeal a Planning Decision' task list page to 'Your appeal statement' page
    Given an appellant is on the 'Appeal a Planning Decision' task list page
    When they click the link 'Upload documents for your appeal'
    Then the 'Your appeal statement page is displayed'

  Scenario Outline: 2. Appellant/agent uploads valid file
    Given an appellant is on the 'Your appeal statement' page
    When they upload a valid file '<filename>'
    And select the checkbox 'I confirm that I have not included any sensitive information in my appeal statement'
    When they select the 'Continue' button
    Then they are presented with the 'Plans and drawings' page
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

  Scenario Outline: 3. Appellant/Agent uploads invalid format
    Given an appellant has uploaded an invalid file '<filename>'
    When they select the 'Continue' button
    Then an error message '<error message>' is displayed
    Examples:
      | filename                                | error message                                                                     |
      | upload_file_large.tiff                  | upload_file_large.tiff must be smaller than 15MB                                  |
      | appeal-statement-invalid-wrong-type.mp3 | appeal-statement-invalid-wrong-type.mp3 must be a DOC, DOCX, PDF, TIF, JPG or PNG |
      | appeal-statement-invalid-wrong-type.csv | appeal-statement-invalid-wrong-type.csv must be a DOC, DOCX, PDF, TIF, JPG or PNG |

  Scenario: 4. Appellant does not upload any document
    Given an appellant has not uploaded any document
    When they select the 'Continue' button
    Then an error message 'Select your appeal statement' is displayed

  Scenario: 5. Appellant does not tick the box to confirm they have not included any sensitive information
    Given an appellant has not ticked the box to confirm they have not included any sensitive information
    When they select the 'Continue' button
    Then an error message 'Select to confirm that you have not included any sensitive information in your appeal statement' is displayed


  Scenario: 6. Appellant does not upload any document or does not tick the box to confirm they have not included any sensitive information
    Given an appellant has not uploaded any document or ticked the box to confirm they have not included any sensitive information
    When they select the 'Continue' button
    Then an error message 'Select your appeal statement' is displayed
    And an error message 'Select to confirm that you have not included any sensitive information in your appeal statement' is displayed

  Scenario: 7. Navigate from 'Your appeal statement' page back to Task List
    Given an appellant is on the 'Your appeal statement' page
    When they click on the 'Back' link
    Then they are presented with the 'Appeal a planning decision' task list page

  Scenario: 8. Uploaded file can be seen when user navigates from Plans and drawings page to Appeal statement page using the Back link
    Given an appellant is on the 'Your appeal statement' page and have uploaded a valid file 'upload-file-valid.jpeg'
    When they select the 'Continue' button
    Then they are presented with the 'Plans and drawings' page
    When they click on the 'Back' link
    Then the uploaded file 'upload-file-valid.jpeg' is displayed
    #And the last task they are working on will show 'In progress'



