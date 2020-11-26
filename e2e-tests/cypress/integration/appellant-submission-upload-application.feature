Feature: Planning Application file submission

  Scenario Outline: Prospective appellant submits valid planning application file
    When user submits a planning application file <filename>
    Then The application file <filename> is submitted and user can proceed
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


  Scenario Outline: Prospective appellant submits invalid planning application file
    When user submits a planning application file <filename>
    Then user is informed that the file is not submitted because <reason>
    Examples:
      | filename                                  | reason                    |
      | "appeal-statement-invalid-wrong-type.csv" | "file type is invalid"    |
