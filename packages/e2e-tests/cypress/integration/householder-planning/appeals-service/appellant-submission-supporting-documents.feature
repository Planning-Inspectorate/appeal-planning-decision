@wip @has
Feature: Appellant submission - Supporting documents

  An appeal can include zero to many uploaded supporting documents.
  Valid supporting documents files must:
  * be one of the white-listed types (doc, docx, pdf, tif, tiff, jpg, jpeg and png) and
  * not exceed a size limit.
  Multiple supporting documents file can been added at the same time.
  A valid uploaded document submitted is added to any previously submitted file.

  Scenario: When no document is uploaded, then the appeal is not updated
    Given the supporting document page is displayed
    When no document is uploaded
    Then no document are submitted

  Scenario: AC3.1: When no new document is uploaded, then previous documents uploaded remains unaltered
    Given supporting document "appeal-statement-valid.pdf" being submitted
    When no document is uploaded
    Then document "appeal-statement-valid.pdf" is submitted

  Scenario Outline: AC1: When a valid document is uploaded, then it is successfully submitted
    Given the supporting document page is displayed
    When a valid document <filename> is uploaded
    Then document <filename> is submitted
    Examples:
      | filename                              |
      | "appeal-statement-valid.doc"          |
      | "appeal-statement-valid.docx"         |
      | "appeal-statement-valid.pdf"          |
      | "appeal-statement-valid.tif"          |
      | "appeal-statement-valid.tiff"         |
      | "appeal-statement-valid.jpg"          |
      | "appeal-statement-valid.jpeg"         |
      | "appeal-statement-valid.png"          |
#      | "appeal-statement-valid-max-size.png" |

  Scenario: AC3: When a valid document is uploaded,  they it's added to existing documents
    Given supporting document "appeal-statement-valid.pdf" being submitted
    When a valid document "appeal-statement-valid.doc" is uploaded
    Then both document "appeal-statement-valid.pdf" and "appeal-statement-valid.doc" are submitted

  Scenario Outline: AC2: When an invalid document is uploaded, then the submission is denied
    Given the supporting document page is displayed
    When an invalid document <filename> is uploaded
    Then document <filename> is not submitted because <reason>
    Examples:
      | filename                                  | reason                    |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    |
#      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" |

  Scenario Outline: AC4: When an invalid document is uploaded, then previous documents uploaded remains unaltered
    Given supporting document "appeal-statement-valid.pdf" being submitted
    When an invalid document <filename> is uploaded
    Then document <filename> is not submitted because <reason>
    And  document "appeal-statement-valid.pdf" is submitted
    Examples:
      | filename                                  | reason                    |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    |
#      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" |

  @wip
  Scenario: When multiple valid documents simultaneously uploaded, then they are successfully submitted
    Given the supporting document page is displayed
    When multiple valid documents are uploaded simultaneously
    Then all the documents are submitted

  @wip
  Scenario: When multiple valid documents simultaneously uploaded, they are added to existing documents
    Given multiple documents were previously submitted
    When multiple valid documents are uploaded simultaneously
    Then the documents are added to the previous ones

    @wip
  Scenario: When multiple invalid documents are uploaded, then all of them are denied submission
    Given the supporting document page is displayed
    When multiple invalid documents are uploaded simultaneously
    Then none of them is submitted

  @wip
  Scenario: When a mix of valid and invalid documents is uploaded, then only valid files are submitted
    Given the supporting document page is displayed
    When mix of valid and invalid documents are uploaded simultaneously
    Then only valid document are submitted
  @wip
  Scenario: When multiple valid documents are uploaded after some documents being denied, they are added to existing documents
    Given multiple valid and invalid documents were previously uploaded
    When multiple valid documents are uploaded simultaneously
    Then the documents are added to the previous ones
