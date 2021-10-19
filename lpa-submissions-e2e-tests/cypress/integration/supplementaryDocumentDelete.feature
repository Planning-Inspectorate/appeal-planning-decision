Feature: As a LPA Planning Officer
  I want to delete an incorrectly uploaded supplementary planning document
  so that it does not form part of the evidence on which the Inspector makes a decision

  Background:
    Given an appeal has been created
    And a questionnaire has been created
    And the LPA Planning Officer is authenticated
    And Add supplementary document is completed for 'upload-file-valid.jpeg' and document name 'Mock document name'

  Scenario: AC01 LPA planning officer deletes a file and file data
    Given progress is made to supplementary document list
    When LPA planning officer selects to delete 'Mock document name' file
    Then delete supplementary planning page is presented

  Scenario: AC02 Deletion confirmed no files remain uploaded
    Given progress is made to delete supplementary page
    And the LPA planning officer confirms deletion
    When the file is deleted
    Then progress is made to supplementary planning add document page

  Scenario: AC03 LPA does not confirm deletion
    Given progress is made to delete supplementary page
    And the LPA planning officer does not confirms deletion
    Then LPA is not able to delete a file

  Scenario: AC04 Deletion confirmed and further files remain uploaded
    Given add another file option is selected
    And Add supplementary document is completed for 'upload-file-valid.pdf' and document name 'New Mock document name'
    And progress is made to supplementary document list
    When LPA planning officer selects to delete 'Mock document name' file
    When delete supplementary planning page is presented
    And the LPA planning officer confirms deletion
    When the file is deleted
    Then progress is made to supplementary document list
    And supplementary document 'New Mock document name' should be visible

  Scenario: AC05 Cancel Deletion after confirmation
    Given Add supplementary document is completed for 'upload-file-valid.jpeg' and document name 'Mock document name'
    And progress is made to delete supplementary page
    And the LPA planning officer confirms deletion
    When cancel is selected
    Then progress is made to supplementary document list

  Scenario: AC06 Cancel Deletion before confirmation
    Given Add supplementary document is completed for 'upload-file-valid.jpeg' and document name 'Mock document name'
    And progress is made to delete supplementary page
    And the LPA planning officer does not confirms deletion
    When cancel is selected
    Then progress is made to supplementary document list

  Scenario: AC07 Appeal Details side panel
    Given Add supplementary document is completed for 'upload-file-valid.jpeg' and document name 'Mock document name'
    And progress is made to delete supplementary page
    Then the appeal details panel is displayed on the right hand side of the page
