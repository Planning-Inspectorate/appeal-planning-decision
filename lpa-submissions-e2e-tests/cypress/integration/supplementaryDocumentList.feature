Feature: As a LPA Planning Officer,
  I want to upload supplementary planning documents,
  so that it can form part of the evidence on which the Inspector makes a decision

  Background:
    Given an appeal has been created
    And a questionnaire has been created


  Scenario Outline: AC01 LPA Planning officer views uploaded file list
    Given Add supplementary document is completed for '<uploadDocument>' and document name '<documentName>'
    Then progress is made to supplementary document list
    And supplementary document is displayed with name '<documentName>'
    Examples:
    |uploadDocument         | documentName       |
    |upload-file-valid.jpeg | Mock document name |

  Scenario Outline: AC02 LPA Planning officer adds multiple files
    Given Add supplementary document is completed for '<uploadDocument>' and document name '<documentName>'
    And progress is made to supplementary document list
    When add another file option is selected
    And Add supplementary document is completed for '<uploadDocumentNew>' and document name '<documentNameNew>'
    Then progress is made to supplementary document list
    And supplementary document is displayed with name '<documentName>'
    And supplementary document is displayed with name '<documentNameNew>'
    Examples:
      |uploadDocument         | documentName       |uploadDocumentNew|documentNameNew|
      |upload-file-valid.jpeg | Mock document name |upload-file-valid.pdf|New Mock document name|

  Scenario Outline: AC03 Supplementary planning document information has been provided - return to tasklist
    Given Add supplementary document is completed for '<uploadDocument>' and document name '<documentName>'
    And progress is made to supplementary document list
    When continue is selected
    Then the LPA Planning Officer is taken to the Task List
    And the 'Supplementary planning documents' subsection is shown as completed
    Examples:
      |uploadDocument         | documentName       |
      |upload-file-valid.jpeg | Mock document name |

  Scenario Outline: AC04 LPA Planning Officer selects to return to previous page from Add Document Page
    Given Add supplementary document is completed for '<uploadDocument>' and document name '<documentName>'
    And progress is made to supplementary document list
    When Back is then requested
    Then the LPA Planning Officer is taken to the Task List
    Examples:
      |uploadDocument         | documentName       |
      |upload-file-valid.jpeg | Mock document name |

  Scenario Outline: AC05 LPA Planning Officer returns to the completed Supplementary planning documents
    Given Add supplementary document is completed for '<uploadDocument>' and document name '<documentName>'
    When progress is made to supplementary document list
    Then the file list with the the previously entered information is presented
    Examples:
      |uploadDocument         | documentName       |
      |upload-file-valid.jpeg | Mock document name |

  Scenario Outline: AC06 LPA Planning Officer returns to the completed Supplementary planning documents and selects back
    Given Add supplementary document is completed for '<uploadDocument>' and document name '<documentName>'
    And progress is made to supplementary document list
    When Back is then requested
    Then the LPA Planning Officer is taken to the Task List
    Examples:
      |uploadDocument         | documentName       |
      |upload-file-valid.jpeg | Mock document name |

  Scenario Outline: AC07 Appeal Details side panel
    Given Add supplementary document is completed for '<uploadDocument>' and document name '<documentName>'
    And progress is made to supplementary document list
    Then the appeal details panel is displayed on the right hand side of the page
    Examples:
      |uploadDocument         | documentName       |
      |upload-file-valid.jpeg | Mock document name |

  Scenario: AC08 Check Your Answers Page
    Given all the mandatory questions for the questionnaire have been completed
    When Check your Answers is displayed
    Then Supplementary planning documents heading is shown and the uploaded file name should be displayed

  Scenario: AC09 Check your answers
    Given all the mandatory questions for the questionnaire have been completed
    When Check your Answers is displayed
    Then Supplementary planning documents heading is shown and the uploaded file name should be displayed

  Scenario: AC10 Change answers
    Given a change to answer 'Supplementary planning documents' is requested from Change your answers page
    When an answer is saved
    Then progress is made to the Check Your Answers page
    And the updated answer is displayed

  Scenario: AC011 Change answer from Check Your Answers Page
    Given a change to answer 'Supplementary planning documents' is requested from Change your answers page
    When an answer is saved
    Then progress is made to the Check Your Answers page
    And the updated answer is displayed

 # Scenario: AC12 PDF & Horizon
 #  Given the questionnaire has been completed
 #  When the LPA Planning Officer submits the questionnaire
 #  Then  data from check your answer page for Supplementary planning is displayed on the PDF
 #  And Supplementary planning documents are present in Horizon
