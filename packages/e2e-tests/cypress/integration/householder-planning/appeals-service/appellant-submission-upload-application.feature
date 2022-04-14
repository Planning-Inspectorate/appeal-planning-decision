@has
Feature: Planning Application file submission

  As an appellant
  I need to be informed when I need to upload my planning application form
  So that I complete my appeal correctly

  An appeal must include an uploaded planning application file.
  Valid planning application files must:
  * be one of the white-listed types (doc, docx, pdf, tif, tiff, jpg, jpeg and png) and
  * not exceed a size limit.
  The latest successfully uploaded planning application file replaces any previously uploaded file.


  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario: Prospective applicant do not upload a planning application file
    Given user did not previously submitted a planning application file
    When user does not submit a planning application file
    Then user is informed that he needs to upload a planning application file

  Scenario: Prospective applicant do not upload a planning application file
    Given user has previously submitted a planning application file "appeal-statement-valid.pdf"
    When user does not submit a planning application file
    Then application file "appeal-statement-valid.pdf" is submitted and user can proceed

  Scenario Outline: Prospective appellant submits valid planning application file
    Given user did not previously submitted a planning application file
    When user submits a planning application file <filename>
    Then application file <filename> is submitted and user can proceed
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

  Scenario: Prospective appellant submits valid planning application file replaces previous file
    Given user has previously submitted a planning application file "appeal-statement-valid.pdf"
    When user submits a planning application file "appeal-statement-valid.doc"
    Then user can see that the planning application file "appeal-statement-valid.doc" "is" submitted

  Scenario Outline: Prospective appellant submits invalid planning application file does not replace previous file
    Given user has previously submitted a planning application file "appeal-statement-valid.pdf"
    When user submits a planning application file <filename>
    Then user is informed that the planning application file is not submitted because <reason>
    And user can see that the planning application file "appeal-statement-valid.pdf" "is" submitted
    Examples:
      | filename                                  | reason                    |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    |
#      | "upload-file-valid-15mb.png"   | "file size exceeds limit" |


  Scenario Outline: Prospective appellant submits invalid planning application file
    When user submits a planning application file <filename>
    Then user is informed that the planning application file is not submitted because <reason>
    Examples:
      | filename                                  | reason                    |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    |
#      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" |


  Scenario Outline: Prospective appellant successfully submits valid planning application file followed by invalid file that is rejected before successfully submitting another valid file
    Given user has previously submitted a valid planning application file <first-valid-file> followed by an invalid file <invalid-file> that was rejected because <reason>
    When user submits a planning application file <second-valid-file>
    Then user can see that the planning application file <second-valid-file> "is" submitted
    Examples:
      | first-valid-file             | invalid-file                              | reason                    | second-valid-file            |
      | "appeal-statement-valid.pdf" | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    | "appeal-statement-valid.doc" |
#      | "appeal-statement-valid.pdf" | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" | "appeal-statement-valid.doc" |

  Scenario Outline: Prospective appellant successfully submits valid planning application file followed by invalid file that is rejected before proceeding without selecting a new file
    Given user has previously submitted a valid planning application file <valid-file> followed by an invalid file <invalid-file> that was rejected because <reason>
    When user does not submit a planning application file
    Then user can see that the planning application file <valid-file> "is" submitted
    Examples:
      | invalid-file                              | reason                    | valid-file                   |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    | "appeal-statement-valid.doc" |
#      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" | "appeal-statement-valid.doc" |
