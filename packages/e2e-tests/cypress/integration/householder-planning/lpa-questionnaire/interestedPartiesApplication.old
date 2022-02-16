@wip
Feature: Interested Parties Application
  As a LPA Planning Officer
  I want to provide the Planning Inspectorate with documents that was used to notify interested parties on the application.
  So that it can form part of the evidence on which the Inspector makes a decision.

  Background:
    Given an appeal has been created
    And a questionnaire has been created

  Scenario: AC1 LPA Planning Officer navigates to interested parties application question
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    When LPA Planning Officer chooses upload the interested parties application
    Then LPA Planning Officer is presented with the ability to upload the interested parties application

  Scenario: AC2 Task list shows the correct initial status
    Given LPA Planning Officer has not added any data to the interested parties application question
    When LPA Planning Officer is reviewing the Task List
    Then the status is not started

  Scenario Outline: AC3 LPA Planning Officer successfully uploads file via upload button
    Given interested parties application question is requested
    When valid file '<valid_file>' is successfully uploaded for 'interestedParties'
    Then progress is made to the task list
    And interested parties application subsection is shown as completed
    Examples:
      | valid_file             |
      | upload-file-valid.tiff |
      | upload-file-valid.tif  |
      | upload-file-valid.png  |
      | upload-file-valid.pdf  |
      | upload-file-valid.jpg  |
      | upload-file-valid.jpeg |
      | upload-file-valid.doc  |
      | upload-file-valid.docx |

  Scenario Outline: AC4 LPA Planning Officer successfully uploads file via Drag and Drop
    Given interested parties application question is requested
    When valid file '<valid_file>' is uploaded via drag and drop for 'interestedParties'
    Then progress is made to the task list
    And interested parties application subsection is shown as completed
    Examples:
      | valid_file             |
      | upload-file-valid.tiff |
      | upload-file-valid.tif  |
      | upload-file-valid.png  |
      | upload-file-valid.pdf  |
      | upload-file-valid.jpg  |
      | upload-file-valid.jpeg |
      | upload-file-valid.doc  |
      | upload-file-valid.docx |

  Scenario Outline: AC5 LPA Planning Officer successfully uploads multiple files
    Given interested parties application question is requested
    When valid multiple files '<multiple_files>' are uploaded for 'interestedParties'
    Then progress is made to the task list
    And interested parties application subsection is shown as completed
    Examples:
      | multiple_files                                                       |
      | upload-file-valid.tiff, upload-file-valid.tif, upload-file-valid.png |
      | upload-file-valid.pdf, upload-file-valid.jpg, upload-file-valid.jpeg |
      | upload-file-valid.doc, upload-file-valid.docx                        |

  Scenario Outline: AC6 LPA Planning Officer selects invalid file size
    Given interested parties application question is requested
    When invalid files '<invalid_file_size>' have been selected for 'interestedParties'
    Then progress is halted with a message the file '<invalid_file_size>' 'is too big'
    Examples:
      | invalid_file_size      |
      | upload_file_large.tiff |

  Scenario Outline: AC7 LPA Planning Officer selects Invalid file format
    Given interested parties application question is requested
    When invalid files '<invalid_format>' have been selected for 'interestedParties'
    Then progress is halted with a message the file '<invalid_format>' 'format is incorrect'
    Examples:
      | invalid_format                     |
      | upload-file-invalid-wrong-type.csv |

  Scenario: AC8 LPA Planning Officer selects to return to previous page
    Given interested parties application question is requested
    And a file has been uploaded for 'interestedParties'
    When Back is then requested
    Then the LPA Planning Officer is taken to the Task List
    And any document uploaded will not be saved

  Scenario: AC9 LPA Planning Officer deletes a file prior to save and continue
    Given a file has been uploaded for 'interestedParties'
    When LPA Planning Officer deletes the file
    Then the file is removed

  Scenario: AC10 LPA Planning Officer deletes a file after save and continue
    Given a file has been uploaded and confirmed for 'interestedParties'
    And interested parties application question is requested
    When LPA Planning Officer deletes the file
    Then the file is removed

  Scenario: AC11 LPA Planning Officer returns to the completed Interested Parties Application question
    Given The question 'Telling interested parties about the application' has been completed for 'interestedParties'
    When interested parties application question is requested
    Then the information they previously entered is still populated

  Scenario: AC12 Appeal details side panel
    Given interested parties application question is requested
    Then the appeal details sidebar is displayed with the correct information

  @nojs @wip
  Scenario Outline: AC13 JavaScript Disabled
    Given interested parties application question is requested
    When valid file '<valid_file>' is successfully uploaded for 'interestedParties'
    Then progress is made to the task list
    And interested parties application subsection is shown as completed
    Examples:
      | valid_file             |
      | upload-file-valid.tiff |

  Scenario: AC14 Check your answers
    Given all the mandatory questions for the questionnaire have been completed
    When Check your Answers is displayed
    Then interested parties application question heading is shown and the uploaded file name should be displayed

  Scenario: AC15 Change answers
    Given a change to answer 'Telling interested parties about the application' is requested from Change your answers page
    When an answer is saved for 'interestedParties'
    Then progress is made to the Check Your Answers page
    And the updated answer is displayed

# Scenario: AC16 PDF & Horizon
#   Given the questionnaire has been completed
#   When the LPA Planning Officer submits the questionnaire
#   Then interested parties application is displayed on the questionnaire PDF
#   And interested parties application and uploaded files are present in Horizon
