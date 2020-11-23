@wip
Feature: Appeal statement file submission

  I want to submit an appeal statement.
  An appeal can have an optional appeal statement in the form of a file uploaded and associated with the appeal.
  The latest uploaded appeal statement file replaces any previously uploaded files.
  Appeal statements files that contain sensitive information are not permitted.
  Valid appeal statement files must:
  * be one of the white-listed types (doc, docx, pdf, tif, tiff, jpg, jpeg and png) and
  * not exceed a size limit.

  Scenario Outline: Valid appeal statement file without sensitive information
    Given I have an appeal statement file <filename> "without" sensitive information
    When I submit the appeal statement file
    Then I can see that the file <filename> "is" submitted
    Examples:
      | filename                      |
      | "appeal-statement-valid.doc"  |
      | "appeal-statement-valid.docx" |
      | "appeal-statement-valid.pdf"  |
      | "appeal-statement-valid.tif"  |
      | "appeal-statement-valid.tiff"  |
      | "appeal-statement-valid.jpg"  |
      | "appeal-statement-valid.jpeg"  |
      | "appeal-statement-valid.png"  |

  Scenario Outline: Valid appeal statement file without sensitive information overwrites previous file
    Given I have previously submitted an appeal statement file <previous-filename>
    And I have an appeal statement file <replacement-filename> "without" sensitive information
    When I submit the appeal statement file
    Then I can see that the file <replacement-filename> "is" submitted
    Examples:
      | previous-filename            | replacement-filename         |
      | "appeal-statement-valid.pdf" | "appeal-statement-valid.doc" |

  Scenario Outline: Valid appeal statement file with sensitive information does not overwrite previous file
    Given I have previously submitted an appeal statement file <previous-filename>
    And I have an appeal statement file <replacement-filename> "with" sensitive information
    When I submit the appeal statement file
    Then I am informed why the file is not submitted
    And I can see that the file <previous-filename> "is" submitted
    Examples:
      | previous-filename            | replacement-filename         |
      | "appeal-statement-valid.pdf" | "appeal-statement-valid.doc" |

  Scenario Outline: Valid appeal statement file with sensitive information
    Given I have an appeal statement file <filename> "with" sensitive information
    When I submit the appeal statement file
    Then I can see that the file <filename> "is not" submitted
    And I am informed why the file is not submitted
    Examples:
      | filename                     |
      | "appeal-statement-valid.doc" |

  Scenario Outline: Invalid appeal statement file without sensitive information
    Given I have an appeal statement file <filename> "without" sensitive information
    When I submit the appeal statement file
    Then I can see that the file <filename> "is not" submitted
    And I am informed why the file is not submitted
    Examples:
      | filename                                            |
      | "appeal-statement-invalid-wrong-type.csv"           |
      | "appeal-statement-invalid-exceeds-maximum-size.pdf" |

  Scenario Outline: Invalid appeal statement file with sensitive information
    Given I have an appeal statement file <filename> "with" sensitive information
    When I submit the appeal statement file
    Then I can see that the file <filename> "is not" submitted
    And I am informed why the file is not submitted
    Examples:
      | filename                                  |
      | "appeal-statement-invalid-wrong-type.csv" |

