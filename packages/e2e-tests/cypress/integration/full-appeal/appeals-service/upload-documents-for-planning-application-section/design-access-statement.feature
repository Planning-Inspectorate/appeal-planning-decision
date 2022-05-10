Feature: As an appellant/agent
  I want to add a copy of the Design and Access Statement
  So that the planning Inspectorate can have the necessary evidence to support my appeal

  Background:
    Given appellant has completed full appeal eligibility journey

 Scenario: 1. Navigate from 'Did you submit a design and access statement with your application? to 'Design and access statement' page
    Given an appellant is on the 'Did you submit a design and access statement with your application' page
    When they select the 'Yes' option
    Then the 'Design and access statement' page is displayed

  Scenario Outline: 2. Appellant/agent uploads valid file
    Given an appellant is on the 'Design and access statement' page
    When they upload a valid file '<filename>'
    And they select the 'Continue' button
    Then they are presented with the 'Decision letter' page
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
    Given an appellant is on the 'Design and access statement' page
    When they drag and drop a file and click on Continue button
    Then they are presented with the 'Decision letter' page

  Scenario Outline: 4. Appellant/Agent uploads invalid format
    Given an appellant has uploaded an invalid file '<filename>'
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
    Then an error message 'Select your design and access statement' is displayed

 Scenario: 6. Navigate from 'Design and access statement' page back to Task List
   Given an appellant is on the 'Design and access statement' page from the task list page
   When they click on the Back link
   Then the user is presented with the 'Did you submit a design and access statement with your application?' page
   When they click on the Back link
   Then the user are presented with plans and drawings documents page
   When they click on the Back link
   Then they are presented with the What is your planning application number? page
   When they click on the Back link  
   Then they are presented with the 'Does the application form include site ownership and agricultural holdings certificate' page
   When they click on the Back link
   Then the user is presented with the 'Planning application form' page
   When they click on the Back link
   Then they are presented with the 'Appeal a planning decision' task list page
##And the last task they are working on will show 'In progress'


