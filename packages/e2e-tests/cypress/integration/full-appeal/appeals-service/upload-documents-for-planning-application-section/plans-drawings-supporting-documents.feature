Feature: As an appellant/agent
  I want to add documents submitted with my application
  So that the Planning Inspectorate can consider the information as part of my appeal

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: AC-01 Navigate from What is your planning application number? page to Plans, drawings and supporting documents page
    Given an appellant is on the What is your planning application number? page
    When appellant enters the planning application number and click continue
    Then appellant is presented with Plans, drawings and supporting documents page

  Scenario Outline: AC-02 Appellant/agent uploads valid file(s) using file upload
    Given an appellant is navigated to the Plans, drawings and supporting documents page
    When appellant uploads a valid file '<filename>' and click continue
    Then appellant is presented with Did you submit a design and access statement with your application page
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

  Scenario: AC-03 Appellant/agent uploads valid file using Drag and Drop
    Given an appellant is navigated to the Plans, drawings and supporting documents page
    When they drag and drop a file and click on Continue button
    Then appellant is presented with Did you submit a design and access statement with your application page

  Scenario: AC-04 Appellant or Agent uploads valid file(s) and wants to add more file
    Given an appellant is navigated to the Plans, drawings and supporting documents page
    When appellant uploads a valid files and click continue
    Then appellant is presented with Did you submit a design and access statement with your application page
    When appellant selects the back link
    Then appellant is presented with Plans, drawings and supporting documents page
    And appellant can see the files already uploaded
    And appellant can replace the files by selecting choose files

  Scenario Outline: AC-05 Appellant uploads a '<InvalidFile>'
    Given an appellant is navigated to the Plans, drawings and supporting documents page
    And an appellant has uploaded an invalid file '<filename>'
    When appellant selects the continue button
    Then an error message '<error message>' is displayed
    Examples:
      | filename                                | error message                                                                     |InvalidFile|
      | upload_file_large.tiff                  | upload_file_large.tiff must be smaller than 15MB                                  |File more than 15 MB|
      | appeal-statement-invalid-wrong-type.mp3 | appeal-statement-invalid-wrong-type.mp3 must be a DOC, DOCX, PDF, TIF, JPG or PNG |Invalid file type   |
      | appeal-statement-invalid-wrong-type.csv | appeal-statement-invalid-wrong-type.csv must be a DOC, DOCX, PDF, TIF, JPG or PNG |Invalid file type   |

  Scenario: AC-06 Appellant does not upload any document
    Given an appellant is navigated to the Plans, drawings and supporting documents page
    When appellant selects the continue button
    Then an error message 'Select your plans, drawings and supporting documents' is displayed

  Scenario Outline: AC-07 Appellant uploads some valid and some invalid files
    Given an appellant is navigated to the Plans, drawings and supporting documents page
    When they upload one '<valid_file>' and one '<invalid_file>' through drag and drop and click continue
    Then an error message '<error_message>' is displayed
    And appellant uploads '<valid_file>' again
    Examples:
      | valid_file                 | invalid_file                            | error_message                             |
      | appeal-statement-valid.tif | appeal-statement-invalid-wrong-type.mp3 | must be a DOC, DOCX, PDF, TIF, JPG or PNG |

  Scenario: AC-08 - Navigate from ‘Plans, drawings and supporting documents’ page back to ‘What is your planning application number?’ page
    Given an appellant is navigated to the Plans, drawings and supporting documents page
    When appellant selects the back link
    Then appellant is presented with the What is your planning application number page
