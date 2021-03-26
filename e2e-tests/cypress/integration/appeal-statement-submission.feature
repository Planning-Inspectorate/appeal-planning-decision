@wip
Feature: Appeal statement file submission

  I want to submit an appeal statement.
  An appeal may include an optional appeal statement file.
  Valid appeal statement files must:
  * be one of the white-listed types (doc, docx, pdf, tif, tiff, jpg, jpeg and png) and
  * not exceed a size limit.
  Appeal statements files that contain sensitive information are not permitted.
  The latest successfully uploaded appeal statement file replaces any previously uploaded file.

  Scenario Outline: Prospective appellant submits valid appeal statement file without sensitive information
    Given user did not previously submitted an appeal statement file
    When user submits an appeal statement file <filename> confirming that it "does not" contain sensitive information
    Then user can see that the appeal statement file <filename> "is" submitted
    Examples:
      | filename                              |
      | "appeal-statement-valid.doc"          |
      | "appeal-statement-valid.docx"         |

  Scenario: Prospective applicant confirms no sensitive information but chooses not to upload an appeal statement file
    Given user did not previously submitted an appeal statement file
    When user confirms that there is no sensitive information without selecting an appeal statement file to upload
    Then user is informed that he needs to upload the appeal statement
