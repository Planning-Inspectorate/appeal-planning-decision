@wip
Feature: Appellant provides the Appeal Site Address
    I need to provide the appeal site address, so that all parties know which site the appeal is against.

    Scenario Outline: Prospective Appellant submits a valid appeal site address
        Given the user is prompted for the site address
        When the user provides their appeal site address as <Address Line 1> and <Address Line 2> and <Town or City> and <County> and <Postcode>
        Then the user is able to continue with the provided address
        #And the user can see that their appeal has been updated with the provided address
        Examples:
            | Address Line 1  | Address Line 2 | Town or City | County       | Postcode  |
            | "1 Taylor Road" | "Clifton"      | "Bristol"    | "South Glos" | "BS8 1TG" |
            | "2 Taylor Road" | ""             | ""           | "South Glos" | "BS8 1TG" |
            | "4 Taylor Road" | ""             | "Bristol"    | "South Glos" | "BS8 1TG" |
            | "5 Taylor Road" | "Clifton"      | ""           | "South Glos" | "BS8 1TG" |

    Scenario Outline: Prospective Appellant submits a site address without a mandatory field
        Given the user is prompted for the site address
        When the user provides their appeal site address as <Address Line 1> and <Address Line 2> and <Town or City> and <County> and <Postcode>
        Then the user is informed that they cannot continue with the provided address because <reason>
        #And the user can see that their appeal has NOT been updated with the provided address
        Examples:
            | Address Line 1 | Address Line 2 | Town or City | County       | Postcode  | reason                       |
            | ""             | ""             | ""           | "South Glos" | "BS8 1TG" | "Address Line 1 is required" |
            | "aaa"          | ""             | ""           | ""           | "BS8 1TG" | "County is required"         |
            | "aaa"          | ""             | ""           | "South Glos" | ""        | "Postcode is required"       |

    Scenario: We can handle multiple required-field failures at once
        Given the user is prompted for the site address
        When the user provides their appeal site address as "" and "" and "" and "" and ""
        Then the user is informed that "Address Line 1 is required"
        And the user is informed that "County is required"
        And the user is informed that "Postcode is required"

    Scenario: We can handle multiple required-field failures for Address Line 1 and County
        Given the user is prompted for the site address
        When the user provides their appeal site address as "" and "" and "" and "" and "BS8 1TG"
        Then the user is informed that "Address Line 1 is required"
        And the user is informed that "County is required"

    Scenario: We can handle multiple required-field failures for Address Line 1 and Postcode
        Given the user is prompted for the site address
        When the user provides their appeal site address as "" and "" and "" and "South Glos" and ""
        Then the user is informed that "Address Line 1 is required"
        And the user is informed that "Postcode is required"

    Scenario: We can handle multiple required-field failures for County and Postcode
        Given the user is prompted for the site address
        When the user provides their appeal site address as "1 Taylor Road" and "" and "" and "" and ""
        Then the user is informed that "County is required"
        And the user is informed that "Postcode is required"

    Scenario Outline: Prospective Appellant provides data that is longer than we accept
        Given the user is prompted for the site address
        When the user provides a value which is too long (<component>: <count>)
        Then the user is informed that they cannot continue with the provided address because <reason>
        #And the user can see that their appeal has NOT been updated with the provided address
        Examples:
            | component        | count | reason                                        |
            | "Address Line 1" | 61    | "Address Line 1 has a limit of 60 characters" |
            | "Address Line 2" | 61    | "Address Line 2 has a limit of 60 characters" |
            | "Town or City"   | 61    | "Town or City has a limit of 60 characters"   |
            | "County"         | 61    | "County has a limit of 60 characters"         |
            | "Postcode"       | 9     | "Postcode has a limit of 8 characters"        |

    Scenario: We can handle multiple character-limit failures at once
        Given the user is prompted for the site address
        When the user provides values that are too long for Address Line 1, Address Line 2, Town or City, County and Postcode
        Then the user is informed that "Address Line 1 has a limit of 60 characters"
        And the user is informed that "Address Line 2 has a limit of 60 characters"
        And the user is informed that "Town or City has a limit of 60 characters"
        And the user is informed that "County has a limit of 60 characters"
        And the user is informed that "Postcode has a limit of 8 characters"
    #And the user can see that their appeal has NOT been updated with the provided address

    Scenario: We can handle a mixture of mandatory / character limit errors
        Given the user is prompted for the site address
        When the user provides values that are too long for Address Line 2 and Town or City and provides no other data
        Then the user is informed that "Address Line 1 is required"
        And the user is informed that "Address Line 2 has a limit of 60 characters"
        And the user is informed that "Town or City has a limit of 60 characters"
        And the user is informed that "County is required"
        And the user is informed that "Postcode is required"
    #And the user can see that their appeal has NOT been updated with the provided address

    Scenario Outline: Postcodes are validated
        Given the user is prompted for the site address
        When the user provides their appeal site address as <Address Line 1> and <Address Line 2> and <Town or City> and <County> and <Postcode>
        Then the user is informed that they cannot continue with the provided address because <reason>
        Examples:
            | Address Line 1  | Address Line 2 | Town or City | County       | Postcode  | reason                                 |
            | "1 Taylor Road" | "Clifton"      | "Bristol"    | "South Glos" | "ZXAS SS" | "postcodes can't be all letters"       |
            | "1 Taylor Road" | "Clifton"      | "Bristol"    | "South Glos" | "1RG 4AX" | "postcodes should begin with a letter" |
