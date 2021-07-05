Feature: Supplementary Planning Documents - Add Document
  As a LPA Planning Officer,
  I want to upload supplementary planning documents,
  so that it can form part of the evidence on which the Inspector makes a decision

  Scenario: AC1 LPA Planning Officer navigates to Add Supplementary planning document questions
    Given Add supplementary document is requested
    Then the LPA Planning Officer is presented with add supplementary document questions

  Scenario Outline: AC2 LPA User successfully uploads <document_type>
    Given Add supplementary document is requested
    When a document has been uploaded
    And the meta data is completed for <document_type>
    Then progress is made to the supplementary document list
    Examples:
      | document_type             |
      | "an adopted document"    |
      | "a not adopted document" |

  Scenario: AC3 LPA User does not upload document and provides relevant information
    Given Add supplementary document is requested
    When file name has been entered
    And formally adopted is selected as 'yes'
    And no file has been selected
    Then progress is halted with a message 'Upload a relevant supplementary planning document'

  Scenario: AC4 LPA User does not upload document
    Given Add supplementary document is requested
    When no file has been selected
    Then the LPA Planning Officer is taken to the Task List

  Scenario Outline: AC5 LPA User selects invalid file size
    Given Add supplementary document is requested
    When invalid file '<invalid_file_size>' has been selected
    Then progress is halted with a message the file '<invalid_file_size>' 'is too big'
    Examples:
      | invalid_file_size      |
      | upload_file_large.tiff |

  Scenario Outline: AC6 LPA User selects invalid file format
    Given Add supplementary document is requested
    When invalid file '<invalid_format>' has been selected
    Then progress is halted with a message the file '<invalid_format>' 'format is incorrect'
    Examples:
      | invalid_format                     |
      | upload-file-invalid-wrong-type.csv |

  Scenario: AC7 LPA User does not enter file name
    Given Add supplementary document is requested
    When no file name has been entered
    Then progress is halted with a message 'file name is missing'

  Scenario: AC8 LPA User does not specify if it’s been adopted
    Given Add supplementary document is requested
    When formally adopted has not been selected
    Then progress is halted with a message 'formally adopted not complete'

  Scenario Outline: AC9 LPA User selects it has been adopted but provides an invalid date <day>-<month>-<year>
    Given Add supplementary document is requested
    When formally adopted is selected as 'yes'
    And an invalid date of <day>-<month>-<year> is provided
    Then progress is halted with an error <error> which highlights <highlights>
    Examples:
      | day  | month | year   | error                                                | highlights       |
      | ""   | ""    | ""     | "Enter date of adoption"                         | "day,month,year" |
      | ""   | ""    | "2022" | "Date of adoption must include a day and month"  | "day,month"      |
      | ""   | ""    | "2021" | "Date of adoption must include a day and month"  | "day,month"      |
      | ""   | ""    | "1000" | "Date of adoption must include a day and month"  | "day,month"      |
      | ""   | ""    | "9999" | "Date of adoption must include a day and month"  | "day,month"      |
      | ""   | "09"  | ""     | "Date of adoption must include a day and year"   | "day,year"       |
      | ""   | "12"  | ""     | "Date of adoption must include a day and year"   | "day,year"       |
      | ""   | "14"  | ""     | "Date of adoption must include a day and year"   | "day,year"       |
      | "31" | ""    | ""     | "Date of adoption must include a month and year" | "month,year"     |
      | "1"  | ""    | ""     | "Date of adoption must include a month and year" | "month,year"     |
      | ""   | "12"  | "2020" | "Date of adoption must include a day"            | "day"            |
      | ""   | "14"  | "2025" | "Date of adoption must include a day"            | "day"            |
      | "31" | ""    | "2021" | "Date of adoption must include a month"          | "month"          |
      | "1"  | "1"   | ""     | "Date of adoption must include a year"           | "year"           |
      | "31" | "12"  | ""     | "Date of adoption must include a year"           | "year"           |
      | "40" | "12"  | "2020" | "Date of adoption must be a real date"           | "day"            |
      | "05" | "14"  | "2025" | "Date of adoption must be a real date"           | "month"          |
      | "1"  | "5"   | "2027" | "Date of adoption must be in the past"           | "day,month,year" |
      | "1"  | "1"   | "2035" | "Date of adoption must be in the past"           | "day,month,year" |
      | "32" | "13"  | "2020" | "Date of adoption must be a real date"           | "day,month"      |
      | "1a" | "0b"  | "2cde" | "Date of adoption must be a real date"           | "day,month,year" |
      | "aa" | "10"  | "2020" | "Date of adoption must be a real date"           | "day"            |
      | "aa" | "bb"  | "2020" | "Date of adoption must be a real date"           | "day,month"      |
      | "31" | "zz"  | "2020" | "Date of adoption must be a real date"           | "month"          |
      | "31" | "10"  | "aaaa" | "Date of adoption must be a real date"           | "year"           |
      | "19" | "10"  | "20"   | "Date of adoption must be a real date"           | "year"           |

  Scenario: AC10 LPA User selects it has not been adopted but does not provide stage reached
    Given Add supplementary document is requested
    When formally adopted is selected as 'no'
    And stage reached is not completed
    Then progress is halted with a message 'stage reached is not complete'
