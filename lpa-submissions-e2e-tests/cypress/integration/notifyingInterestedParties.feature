Feature: Notifying interested parties of the appeal
  As a LPA Planning Officer
  I want to provide the Planning Inspectorate with documents that was used to notify interested parties on the application.
  So that this can form part of the Inspectors decision.

  Background:
    Given an appeal has been created
    And a questionnaire has been created
    And the LPA Planning Officer is authenticated

  Scenario: AC1 Access Notifying interested parties of the appeal about the application question
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    When LPA Planning Officer chooses to upload the document Notifying interested parties of the appeal
    Then LPA Planning Officer is presented with the ability to upload any documents relevant to the question Notifying interested parties of the appeal

  Scenario: AC2 Task list shows the correct initial status
    Given LPA Planning Officer has not added any data to the Notifying interested parties of the appeal question
    When LPA Planning Officer is reviewing the Task List
    Then the status is not started

  Scenario Outline: AC3 LPA Planning Officer successfully uploads file via upload button
    Given Notifying interested parties of the appeal is requested
    When valid file '<valid_file>' is successfully uploaded
    Then progress is made to the task list
    And Notifying interested parties of the appeal subsection is shown as completed
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
    Given Notifying interested parties of the appeal is requested
    When valid file '<valid_file>' is uploaded via drag and drop
    Then progress is made to the task list
    And Notifying interested parties of the appeal subsection is shown as completed
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
    Given Notifying interested parties of the appeal is requested
    When valid multiple files '<multiple_files>' are uploaded
    Then progress is made to the task list
    And Notifying interested parties of the appeal subsection is shown as completed
    Examples:
      | multiple_files                                                       |
      | upload-file-valid.tiff, upload-file-valid.tif, upload-file-valid.png |
      | upload-file-valid.pdf, upload-file-valid.jpg, upload-file-valid.jpeg |
      | upload-file-valid.doc, upload-file-valid.docx                        |

  Scenario Outline: AC6 LPA Planning Officer selects invalid file size
    Given Notifying interested parties of the appeal is requested
    When invalid files '<invalid_file_size>' have been selected
    Then progress is halted with a message the file '<invalid_file_size>' 'is too big'
    Examples:
      | invalid_file_size      |
      | upload_file_large.tiff |

  Scenario Outline: AC7 LPA Planning Officer selects Invalid file format
    Given Notifying interested parties of the appeal is requested
    When invalid files '<invalid_format>' have been selected
    Then progress is halted with a message the file '<invalid_format>' 'format is incorrect'
    Examples:
      | invalid_format                     |
      | upload-file-invalid-wrong-type.csv |

  Scenario: AC8 LPA Planning Officer selects to return to previous page
    Given Notifying interested parties of the appeal is requested
    And a file has been uploaded
    When Back is then requested
    Then the LPA Planning Officer is taken to the Task List
    And any document uploaded will not be saved

  Scenario: AC9 LPA Planning Officer deletes a file prior to save and continue
    Given a file has been uploaded
    When LPA Planning Officer deletes the file
    Then the file is removed

  Scenario: AC10 LPA Planning Officer deletes a file after save and continue
    Given a file has been uploaded and confirmed
    And Notifying interested parties of the appeal is requested
    When LPA Planning Officer deletes the file
    Then the file is removed

  Scenario: AC11 LPA Planning Officer returns to the completed Notifying interested parties of the appeal
    Given The question 'Notifying interested parties of the appeal' has been completed
    When Notifying interested parties of the appeal is requested
    Then the information they previously entered is still populated

  Scenario: AC12 Appeal details side panel
    Given Notifying interested parties of the appeal is requested
    Then the appeal details panel is displayed on the right hand side of the page

  @nojs
  Scenario Outline: AC13 JavaScript Disabled
    Given Notifying interested parties of the appeal is requested
    When valid file '<valid_file>' is successfully uploaded
    Then progress is made to the task list
    And Notifying interested parties of the appeal subsection is shown as completed
    Examples:
      | valid_file             |
      | upload-file-valid.tiff |

  Scenario: AC14 Check your answers
    Given all the mandatory questions for the questionnaire have been completed
    When Check your Answers is displayed
    Then Notifying interested parties of the appeal heading is shown and the uploaded file name should be displayed

  Scenario: AC15 Change answers
    Given a change to answer 'Notifying interested parties of the appeal' is requested from Change your answers page
    When an answer is saved
    Then progress is made to the Check Your Answers page
    And the updated answer is displayed

  # Scenario: AC16 PDF & Horizon
  #   Given the questionnaire has been completed
  #   When the LPA Planning Officer submits the questionnaire
  #   Then Notifying interested parties of the appeal is displayed on the  questionnaire PDF
  #   And Notifying interested parties of the appeal and uploaded files are present in Horizon
