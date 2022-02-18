@wip @has
Feature: Appellant provides the Appeal Site Address
  I need to provide the appeal site address, so that all parties know which site the appeal is against.
  Note: This feature describes behaviour for a newly created appeal

  Scenario: Section status update - valid appeal site address
    Given appeal site address is requested
    When valid appeal site address is submitted
    Then Address of the appeal site section is "COMPLETED"

  Scenario: Section status update - invalid appeal site address
    Given appeal site address is requested
    When invalid appeal site address is submitted
    Then Address of the appeal site section is "NOT STARTED"

  @as-2483
  Scenario Outline: Prospective Appellant submits a valid appeal site address
    Given the user is prompted for the site address
    When the user provides their appeal site address as <Address Line 1> and <Address Line 2> and <Town or City> and <County> and <Postcode>
    Then the user is able to continue with the provided address
    And the user can see that their appeal has been updated with the provided site address as <Address Line 1> and <Address Line 2> and <Town or City> and <County> and <Postcode>
    Examples:
      | Address Line 1  | Address Line 2 | Town or City | County       | Postcode   |
      | "1 Taylor Road" | "Clifton"      | "Bristol"    | "South Glos" | "BS8 1TG"  |
      | "2 Taylor Road" | ""             | ""           | ""           | "M1 1AA"   |
      | "4 Taylor Road" | ""             | "Bristol"    | "South Glos" | "M60 1NW"  |
      | "5 Taylor Road" | "Clifton"      | ""           | "South Glos" | "DN55 1PT" |
      | "5 Taylor Road" | "Clifton"      | "Bristol"    | ""           | "DN55 1PT" |

  @as-2483
  Scenario Outline: Prospective Appellant submits an appeal site address without mandatory information
    Given the user is prompted for the site address
    When the user provides their appeal site address as <Address Line 1> and <Address Line 2> and <Town or City> and <County> and <Postcode>
    Then the user is informed that they cannot continue with the provided address because <reason>
    And the user can see that their appeal has not been updated with the provided address
    Examples:
      | Address Line 1 | Address Line 2 | Town or City | County       | Postcode   | reason                       |
      | ""             | ""             | ""           | "South Glos" | "W1A 1HQ"  | "Address Line 1 is required" |
      | "aaa"          | ""             | ""           | ""           | ""         | "Postcode is required"       |

  @as-1680 @as-2483
  Scenario: Prospective appellant fails to provide any address information
    Given the user is prompted for the site address
    When the user provides their appeal site address as "" and "" and "" and "" and ""
    Then the user is informed that "Address Line 1 is required"
    And the user is informed that "Postcode is required"

  Scenario: Prospective appellant fails to provide first address line and Postcode
    Given the user is prompted for the site address
    When the user provides their appeal site address as "" and "" and "" and "South Glos" and ""
    Then the user is informed that "Address Line 1 is required"
    And the user is informed that "Postcode is required"

  @as-2483
  Scenario Outline: Prospective appellant provides address data that exceeds the maximum length constraint for each field
    Given the user is prompted for the site address
    When the user provides a value which is too long - <component> : <count>
    Then the user is informed that they cannot continue with the provided address because <reason>
    And the user can see that their appeal has not been updated with the provided address
    Examples:
      | component        | count | reason                                        |
      | "Address Line 1" | 61    | "Address Line 1 has a limit of 60 characters" |
      | "Address Line 2" | 61    | "Address Line 2 has a limit of 60 characters" |
      | "Town or City"   | 61    | "Town or City has a limit of 60 characters"   |
      | "County"         | 61    | "County has a limit of 60 characters"         |
      | "Postcode"       | 9     | "Postcode has a limit of 8 characters"        |

  @as-2483
  Scenario: Prospective appellant provides address data that exceeds the maximum length constraint for multiple fields
    Given the user is prompted for the site address
    When the user provides values that are too long for Address Line 1, Address Line 2, Town or City, County and Postcode
    Then the user is informed that "Address Line 1 has a limit of 60 characters"
    And the user is informed that "Address Line 2 has a limit of 60 characters"
    And the user is informed that "Town or City has a limit of 60 characters"
    And the user is informed that "County has a limit of 60 characters"
    And the user is informed that "Postcode has a limit of 8 characters"
    And the user can see that their appeal has not been updated with the provided address

  @as-2483
  Scenario: Prospective appellant provides invalid address data with some missing fields and others that exceed the maximum length constraint
    Given the user is prompted for the site address
    When the user provides values that are too long for Address Line 2 and Town or City and provides no other data
    Then the user is informed that "Address Line 1 is required"
    And the user is informed that "Address Line 2 has a limit of 60 characters"
    And the user is informed that "Town or City has a limit of 60 characters"
    And the user is informed that "Postcode is required"
    And the user can see that their appeal has not been updated with the provided address

  Scenario Outline: Prospective appellant provides address data with invalid Postcode
    Given the user is prompted for the site address
    When the user provides their appeal site address with postcode as <Postcode>
    Then the user is informed that they cannot continue with the provided address because <reason>
    Examples:
      | Postcode  | reason                                 |
      | "ZXAS SS" | "Postcodes can't be all letters"       |
      | "1RG 4AX" | "Postcodes should begin with a letter" |
