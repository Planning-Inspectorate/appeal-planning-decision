Feature: Appellant submission - decision letter

  An appeal must include an uploaded decision letter file.
  Valid decision letter files must:
  * be one of the white-listed types (doc, docx, pdf, tif, tiff, jpg, jpeg and png) and
  * not exceed a size limit.
  The latest successfully uploaded decision letter file replaces any previously uploaded file.

  Scenario: Prospective applicant do not upload a decision letter file
    When user does not submit a decision letter file
    Then user can see that no decision letter file is submitted

  Scenario Outline: Prospective appellant submits valid decision letter file
    When user submits a decision letter file <filename>
    Then The decision letter file <filename> is submitted and user can proceed
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
      | "appeal-statement-valid-max-size.png" |


  Scenario: Prospective appellant submits valid decision letter file replaces previous file
    Given user has previously submitted a decision letter file "appeal-statement-valid.pdf"
    When user submits a decision letter file "appeal-statement-valid.doc"
    Then user can see that the decision letter file "appeal-statement-valid.doc" "is" submitted

  Scenario Outline: Prospective appellant submits invalid decision letter file does not replace previous file
    Given user has previously submitted a decision letter file "appeal-statement-valid.pdf"
    When user submits a decision letter file <filename>
    Then user is informed that the decision letter file is not submitted because <reason>
    And user can see that the decision letter file "appeal-statement-valid.pdf" "is" submitted
    Examples:
      | filename                                  | reason                    |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    |
      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" |

  Scenario Outline: Prospective appellant submits invalid decision letter file
    When user submits a decision letter file <filename>
    Then user is informed that the decision letter file is not submitted because <reason>
    Examples:
      | filename                                  | reason                    |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    |
      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" |



  Scenario Outline: Prospective appellant successfully submits valid decision letter file followed by invalid file that is rejected before successfully submitting another valid file
    Given user has previously submitted a valid decision letter file <first-valid-file> followed by an invalid file <invalid-file> that was rejected because <reason>
    When user submits a decision letter file <second-valid-file>
    Then user can see that the decision letter file <second-valid-file> "is" submitted
    Examples:
      | first-valid-file             | invalid-file                              | reason                    | second-valid-file            |
      | "appeal-statement-valid.pdf" | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    | "appeal-statement-valid.doc" |
      | "appeal-statement-valid.pdf" | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" | "appeal-statement-valid.doc" |

  Scenario Outline: Prospective appellant successfully submits valid decision letter file followed by invalid file that is rejected before proceeding without selecting a new file
    Given user has previously submitted a valid decision letter file <valid-file> followed by an invalid file <invalid-file> that was rejected because <reason>
    When user does not submit a decision letter file
    Then user can see that the decision letter file <valid-file> "is" submitted
    Examples:
      | invalid-file                              | reason                    | valid-file                   |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    | "appeal-statement-valid.doc" |
      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" | "appeal-statement-valid.doc" |
