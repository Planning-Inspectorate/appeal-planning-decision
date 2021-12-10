Feature: Representations from interested parties
  As a LPA Planning Officer
  I want to provide the Planning Inspectorate with any Representations from interested parties.
  So that this can form part of the Inspectors decision.

  Background:
    Given an appeal has been created
    And a questionnaire has been created

  Scenario: AC1 LPA  Planning officer navigates to ‘Representations from interested parties.’ question
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    When LPA Planning Officer chooses to upload the document Representations from interested parties
    Then LPA Planning Officer is presented with the ability to upload any documents relevant to the question Representations from interested parties

  Scenario: AC2. Task list shows the correct initial status
    Given LPA Planning Officer has not added any data to the Representations from Interested Parties question
    When LPA Planning Officer is reviewing the Task List
    Then the status is not started

  Scenario Outline: AC3 LPA Planning Officer successfully uploads file via upload button
    Given Representations from interested parties question is requested
    When valid file '<valid_file>' is successfully uploaded for 'representations'
    Then progress is made to the task list
    And Representations from interested parties subsection is shown as completed
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
    Given Representations from interested parties question is requested
    When valid file '<valid_file>' is uploaded via drag and drop for 'representations'
    Then progress is made to the task list
    And Representations from interested parties subsection is shown as completed
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
    Given Representations from interested parties question is requested
    When valid multiple files '<multiple_files>' are uploaded for 'representations'
    Then progress is made to the task list
    And Representations from interested parties subsection is shown as completed
    Examples:
      | multiple_files                                                       |
      | upload-file-valid.tiff, upload-file-valid.tif, upload-file-valid.png |
      | upload-file-valid.pdf, upload-file-valid.jpg, upload-file-valid.jpeg |
      | upload-file-valid.doc, upload-file-valid.docx                        |

  Scenario Outline: AC6 LPA Planning Officer selects invalid file size
    Given Representations from interested parties question is requested
    When invalid files '<invalid_file_size>' have been selected for 'representations'
    Then progress is halted with a message the file '<invalid_file_size>' 'is too big'
    Examples:
      | invalid_file_size      |
      | upload_file_large.tiff |

  Scenario Outline: AC7 LPA Planning Officer selects Invalid file format
    Given Representations from interested parties question is requested
    When invalid files '<invalid_format>' have been selected for 'representations'
    Then progress is halted with a message the file '<invalid_format>' 'format is incorrect'
    Examples:
      | invalid_format                     |
      | upload-file-invalid-wrong-type.csv |

  Scenario: AC8 LPA Planning Officer selects to return to previous page
    Given Representations from interested parties question is requested
    And a file has been uploaded for 'representations'
    When Back is then requested
    Then the LPA Planning Officer is taken to the Task List
    And any document uploaded will not be saved

  Scenario: AC9  LPA Planning Officer deletes a file prior to save and continue
    Given a file has been uploaded for 'representations'
    When LPA Planning Officer deletes the file
    Then the file is removed

  Scenario: AC10  LPA Planning Officer deletes a file after save and continue
    Given a file has been uploaded and confirmed for 'representations'
    And Representations from interested parties question is requested
    When LPA Planning Officer deletes the file
    Then the file is removed

  Scenario: AC11 LPA Planning Officer returns to the completed Upload the plans used to reach the decision question
    Given The question 'Representations from Interested parties' has been completed for 'representations'
    When the Representations from interested parties question is requested
    Then the information they previously entered is still populated

  Scenario: AC12 Appeal details side panel
    Given Representations from interested parties question is requested
    Then the appeal details panel is displayed on the right hand side of the page

  @nojs
  Scenario Outline: AC13 JavaScript Disabled
    Given Representations from interested parties question is requested
    When valid file '<valid_file>' is successfully uploaded for 'representations'
    Then progress is made to the task list
    And Representations from interested parties subsection is shown as completed
    Examples:
      | valid_file             |
      | upload-file-valid.tiff |

  Scenario: AC14 Check your answers
    Given all the mandatory questions for the questionnaire have been completed
    When Check your Answers is displayed
    Then Representations from Interested parties heading and the uploaded file name should be displayed

  Scenario: AC15 Change answers
    Given a change to answer 'Representations from Interested parties' is requested from Change your answers page
    When an answer is saved for 'representations'
    Then progress is made to the Check Your Answers page
    And the updated answer is displayed

  # Scenario: AC16 PDF & Horizon
  #   Given the questionnaire has been completed
  #   When the LPA Planning Officer submits the questionnaire
  #   Then the Representations from Interested parties is displayed on the PDF
  #   And the Representations from Interested parties is present in Horizon
