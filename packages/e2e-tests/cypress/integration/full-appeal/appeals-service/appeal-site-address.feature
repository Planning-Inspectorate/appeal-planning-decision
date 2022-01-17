Feature: Appellant provides the Appeal Site Address
  I need to provide the appeal site address, so that all parties know which site the appeal is against.

  Scenario: 1. Navigate from 'Task List page' to 'What is the address of the appeal site?' page
    Given an appellant is on the 'Task List' page
    When they click the 'Tell us about the appeal site' link on the Task List page
    Then the 'What is the address of the appeal site?' page is displayed

  Scenario Outline: 2. The appellant submits a valid appeal site address
    Given an appellant is on the 'What is the address of the appeal site?' page
    When the appellant provides their appeal site address as <Address Line 1> and <Address Line 2> and <Town or City> and <County> and <Postcode>
    And they click the 'Continue' button
    Then the page 'Do you own all the land?' is displayed
    Examples:
      | Address Line 1  | Address Line 2 | Town or City | County       | Postcode   |
      | "1 Taylor Road" | "Clifton"      | "Bristol"    | "South Glos" | "BS8 1TG"  |
      | "2 Taylor Road" | ""             | ""           | ""           | "M1 1AA"   |
      | "4 Taylor Road" | ""             | "Bristol"    | "South Glos" | "M60 1NW"  |
      | "5 Taylor Road" | "Clifton"      | ""           | "South Glos" | "DN55 1PT" |
      | "5 Taylor Road" | "Clifton"      | "Bristol"    | ""           | "DN55 1PT" |

  Scenario Outline: 3. The appellant submits an appeal site address without mandatory information
    Given an appellant is on the 'What is the address of the appeal site?' page
    When the appellant provides their appeal site address as <Address Line 1> and <Address Line 2> and <Town or City> and <County> and <Postcode>
    And they click the 'Continue' button
    Then the appellant remains on the 'What is the address of the appeal site?' page
    And the appellant is informed that <Reason>
    Examples:
      | Address Line 1 | Address Line 2 | Town or City | County       | Postcode   | Reason                       |
      | ""             | ""             | ""           | "South Glos" | "W1A 1HQ"  | "Address Line 1 is required" |
      | "aaa"          | ""             | ""           | ""           | ""         | "Postcode is required"       |

  Scenario: 4. The appellant fails to provide any address information
    Given an appellant is on the 'What is the address of the appeal site?' page
    When the appellant provides their appeal site address as '' and '' and '' and '' and ''
    And they click the 'Continue' button
    Then the appellant remains on the 'What is the address of the appeal site?' page
    And the appellant is informed that "Address Line 1 is required"
    And the appellant is informed that "Postcode is required"

  Scenario: 5. The appellant fails to provide first address line and postcode
    Given an appellant is on the 'What is the address of the appeal site?' page
    When the appellant provides their appeal site address as '' and '' and '' and 'South Glos' and ''
    And they click the 'Continue' button
    Then the appellant remains on the 'What is the address of the appeal site?' page
    And the appellant is informed that "Address Line 1 is required"
    And the appellant is informed that "Postcode is required"

  Scenario Outline: 6. The appellant provides address data that exceeds the maximum length constraint for each field
    Given an appellant is on the 'What is the address of the appeal site?' page
    When the appellant provides a value which is too long - <Component> : <Count>
    And they click the 'Continue' button
    Then the appellant remains on the 'What is the address of the appeal site?' page
    And the appellant is informed that <Reason>
    Examples:
      | Component        | Count | Reason                                        |
      | "Address Line 1" | 61    | "Address Line 1 has a limit of 60 characters" |
      | "Address Line 2" | 61    | "Address Line 2 has a limit of 60 characters" |
      | "Town or City"   | 61    | "Town or City has a limit of 60 characters"   |
      | "County"         | 61    | "County has a limit of 60 characters"         |
      | "Postcode"       | 9     | "Postcode has a limit of 8 characters"        |

  Scenario: 7. The appellant provides address data that exceeds the maximum length constraint for multiple fields
    Given an appellant is on the 'What is the address of the appeal site?' page
    When the appellant provides values that are too long for Address Line 1, Address Line 2, Town or City, County and Postcode
    And they click the 'Continue' button
    Then the appellant remains on the 'What is the address of the appeal site?' page
    And the appellant is informed that "Address Line 1 has a limit of 60 characters"
    And the appellant is informed that "Address Line 2 has a limit of 60 characters"
    And the appellant is informed that "Town or City has a limit of 60 characters"
    And the appellant is informed that "County has a limit of 60 characters"
    And the appellant is informed that "Postcode has a limit of 8 characters"

  Scenario: 8. The appellant provides invalid address data with some missing fields and others that exceed the maximum length constraint
    Given an appellant is on the 'What is the address of the appeal site?' page
    When the appellant provides values that are too long for Address Line 2 and Town or City and provides no other data
    And they click the 'Continue' button
    Then the appellant remains on the 'What is the address of the appeal site?' page
    Then the appellant is informed that "Address Line 1 is required"
    And the appellant is informed that "Address Line 2 has a limit of 60 characters"
    And the appellant is informed that "Town or City has a limit of 60 characters"
    And the appellant is informed that "Postcode is required"

  Scenario Outline: 9. The appellant provides address data with invalid Postcode
    Given an appellant is on the 'What is the address of the appeal site?' page
    When the appellant provides their appeal site address with postcode as <Postcode>
    And they click the 'Continue' button
    Then the appellant remains on the 'What is the address of the appeal site?' page
    And the appellant is informed that <Reason>
    Examples:
      | Postcode  | Reason                                 |
      | "ZXAS SS" | "Postcodes cannot be all letters"      |
      | "1RG 4AX" | "Postcodes should begin with a letter" |

  Scenario: 10. Navigate from the 'What is the address of the appeal site?' page back to the 'Task List' page
    Given an appellant is on the 'What is the address of the appeal site?' page
    When they click the 'Back' link
    Then the 'Task List' page is displayed
