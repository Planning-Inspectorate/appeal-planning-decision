@wip @has
Feature: Appeal statement file submission

  I want to submit an appeal statement.
  Valid appeal statement files must:
  * be one of the white-listed types (doc, docx, pdf, tif, tiff, jpg, jpeg and png) and
  * not exceed a size limit.
  Appeal statements files that contain sensitive information are not permitted.
  The latest successfully uploaded appeal statement file replaces any previously uploaded file.

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario Outline: Prospective appellant submits valid appeal statement file without sensitive information
    Given user did not previously submitted an appeal statement file
    When user submits an appeal statement file <filename> confirming that it "does not" contain sensitive information
    Then user can see that the appeal statement file <filename> "is" submitted
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


  Scenario: Prospective applicant confirms no sensitive information but chooses not to upload an appeal statement file
    Given user did not previously submitted an appeal statement file
    When user confirms that there is no sensitive information without selecting an appeal statement file to upload
    Then user is informed that he needs to select an appeal statement


  Scenario: Prospective does not provide appeal statement but had previously submitted one
    Given user has previously submitted an appeal statement file "appeal-statement-valid.pdf"
    When user submits an appeal statement file "appeal-statement-valid.doc" confirming that it "does not" contain sensitive information
    Then user can see that the appeal statement file "appeal-statement-valid.doc" "is" submitted


  Scenario: Prospective applicant chooses not to upload an appeal statement file and does not confirm no sensitive information
    Given user did not previously submitted an appeal statement file
    When user does not confirm that there is no sensitive information nor upload a statement
    Then user is informed that he needs to select an appeal statement and confirms that it does not contain sensitive information


  Scenario: Prospective appellant submits valid appeal statement file without sensitive information replaces previous file
    Given user has previously submitted an appeal statement file "appeal-statement-valid.pdf"
    When user submits an appeal statement file "appeal-statement-valid.doc" confirming that it "does not" contain sensitive information
    Then user can see that the appeal statement file "appeal-statement-valid.doc" "is" submitted


  Scenario: Prospective appellant submits valid appeal statement file with sensitive information does not replace previous file
    Given user has previously submitted an appeal statement file "appeal-statement-valid.pdf"
    When user submits an appeal statement file "appeal-statement-valid.doc" confirming that it "does" contain sensitive information
    Then user is informed that the file is not submitted because "file contains sensitive information"
    And user can see that the appeal statement file "appeal-statement-valid.pdf" "is" submitted


  Scenario: Prospective appellant submits valid appeal statement file with sensitive information
    When user submits an appeal statement file "appeal-statement-valid.doc" confirming that it "does" contain sensitive information
    Then user is informed that the file is not submitted because "file contains sensitive information"
    And user can see that the appeal statement file "appeal-statement-valid.doc" "is not" submitted

  Scenario Outline: Prospective appellant submits invalid appeal statement file without sensitive information
    When user submits an appeal statement file <filename> confirming that it "does not" contain sensitive information
    Then user is informed that the file is not submitted because <reason>
    And user can see that the appeal statement file <filename> "is not" submitted
    Examples:
      | filename                                  | reason                    |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    |
#      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" |

  Scenario Outline: Prospective appellant submits invalid appeal statement file without sensitive information does not replace previous file
    Given user has previously submitted an appeal statement file "appeal-statement-valid.pdf"
    When user submits an appeal statement file <filename> confirming that it "does not" contain sensitive information
    Then user is informed that the file is not submitted because <reason>
    And user can see that the appeal statement file "appeal-statement-valid.pdf" "is" submitted
    Examples:
      | filename                                  | reason                    |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    |
#      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" |


  Scenario Outline: Prospective appellant submits invalid appeal statement file with sensitive information
    When user submits an appeal statement file <filename> confirming that it "does" contain sensitive information
    Then user is informed that the file is not submitted because "file contains sensitive information"
    And user is informed that the file is not submitted because <reason>
    And user can see that the appeal statement file <filename> "is not" submitted
    Examples:
      | filename                                  | reason                    |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    |
#      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" |

  Scenario Outline: Prospective appellant successfully submits valid appeal statement file followed by invalid file that is rejected before successfully submitting another valid file
    Given user has previously submitted a valid appeal statement file <first-valid-file> followed by an invalid file <invalid-file> that was rejected because <reason>
    When user submits an appeal statement file <second-valid-file> confirming that it "does not" contain sensitive information
    Then user can see that the appeal statement file <second-valid-file> "is" submitted
    Examples:
      | first-valid-file             | invalid-file                              | reason                    | second-valid-file            |
      | "appeal-statement-valid.pdf" | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    | "appeal-statement-valid.doc" |
#      | "appeal-statement-valid.pdf" | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" | "appeal-statement-valid.doc" |


  Scenario Outline: Prospective appellant successfully submits valid appeal statement file followed by invalid file that is rejected before proceeding without selecting a new file
    Given user has previously submitted a valid appeal statement file <valid-file> followed by an invalid file <invalid-file> that was rejected because <reason>
    When user confirms that there is no sensitive information without selecting an appeal statement file to upload
    Then user can see that the appeal statement file <valid-file> "is" submitted
    Examples:
      | invalid-file                              | reason                    | valid-file                   |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    | "appeal-statement-valid.doc" |
#      | "appeal-statement-invalid-too-big.png"    | "file size exceeds limit" | "appeal-statement-valid.doc" |

