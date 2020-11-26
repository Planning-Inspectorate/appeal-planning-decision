@wip
Feature: Appellant submission - decision letter

  An appeal must include an uploaded decision letter file.
  Valid decision letter files must:
  * be one of the white-listed types (doc, docx, pdf, tif, tiff, jpg, jpeg and png) and
  * not exceed a size limit.
  The latest successfully uploaded decision letter file replaces any previously uploaded file.

  Scenario Outline: Prospective appellant submits valid decision letter file
    When user submits a decision letter file <filename>
    Then user can see that the decision letter file <filename> "is" submitted
    Examples:
      | filename                         |
      | "upload-file-valid.doc"          |
      | "upload-file-valid.docx"         |
      | "upload-file-valid.pdf"          |
      | "upload-file-valid.tif"          |
      | "upload-file-valid.tiff"         |
      | "upload-file-valid.jpg"          |
      | "upload-file-valid.jpeg"         |
      | "upload-file-valid.png"          |
      | "upload-file-valid-max-size.png" |

  Scenario: Prospective appellant submits valid decision letter file to replace a previous file
    Given user has previously submitted a decision letter file "upload-file-valid.pdf"
    When user submits a decision letter file "upload-file-valid.doc"
    Then user can see that the decision letter file "upload-file-valid.doc" "is" submitted

  Scenario Outline: Prospective appellant submits invalid decision letter file
    When user submits a decision letter file <filename>
    Then user is informed that the file is not submitted because <reason>
    And user can see that the decision letter file <filename> "is not" submitted
    Examples:
      | filename                             | reason                    |
      | "upload-file-invalid-wrong-type.csv" | "file type is invalid"    |
      | "upload-file-invalid-too-big.png"    | "file size exceeds limit" |


