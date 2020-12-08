@wip
Feature: Appellant provides the Appeal Site Address
    I need to provide the appeal site address, so that all parties know which site the appeal is against.

    Scenario Outline: Prospective Appellant submits valid appeal site address
        When the user provides their appeal site address as <Adress Line 1> and <Adress Line 2> and <Town or City> and <County> and <Postcode>
        Then the user should see the appeal site address "is" submitted

        Examples:
            | Adress Line 1   | Adress Line 2 | Town or City | County       | Postcode  |
            | "1 Taylor Road" | "Clifton"     | "Bristol"    | "South Glos" | "BS8 1TG" |
            | "2 Taylor Road" | ""            | ""           | "South Glos" | "BS8 1TG" |
            | "4 Taylor Road" | ""            | "Bristol"    | "South Glos" | "BS8 1TG" |
            | "5 Taylor Road" | "Clifton"     | ""           | "South Glos" | "BS8 1TG" |


    Scenario Outline: Prospective Appellant submits invalid appeal site address
        When the user provides their appeal site address as <Adress Line 1> and <Adress Line 2> and <Town or City> and <County> and <Postcode>
        Then user is informed that the address is not submitted because <reason>
        And the user should see the appeal site address "is not" submitted

        Examples:
            | Adress Line 1              | Adress Line 2         | Town or City          | County                     | Postcode                 | reason                                                             |
            | ""                         | ""                    | ""                    | ""                         | ""                       | "Enter a building and/or street, Enter a county, Enter a postcode" |
            | ""                         | "Clifton"             | "Bristol"             | "South Glos"               | "BS8 1TG"                | "Enter a building and/or street"                                   |
            | ""                         | "Clifton"             | "Bristol"             | ""                         | "BS8 1TG"                | "Enter a building and/or street, Enter a county"                   |
            | ""                         | "Clifton"             | "Bristol"             | "South Glos"               | ""                       | "Enter a building and/or street, Enter a postcode"                 |
            | "6 Taylor Road"            | "Clifton"             | "Bristol"             | ""                         | "BS8 1TG"                | "Enter a county"                                                   |
            | "7 Taylor Road"            | "Clifton"             | "Bristol"             | "South Glos"               | ""                       | "Enter a postcode"                                                 |
            | "8 Taylor Road"            | "Clifton"             | "Bristol"             | ""                         | ""                       | "Enter a county, Enter a postcode"                                 |
            | "1 Taylor Road"            | "Clifton"             | "Bristol"             | "South Glos"               | "ZXAS SS"                | "Enter a valid postcode"                                           |
            | "1 Taylor Road 61 charlen" | "Clifton"             | "Bristol"             | "South Glos"               | "BS8 1TG"                | "Building and/or street must be 60 characters or fewer"            |
            | "1 Taylor Road"            | "Clifton 61 char len" | "Bristol"             | "South Glos"               | "BS8 1TG"                | "Building and/or street must be 60 characters or fewer"            |
            | "1 Taylor Road"            | "Clifton"             | "Bristol 61 char len" | "South Glos"               | "BS8 1TG"                | "Town or city must be 60 characters or fewer"                      |
            | "1 Taylor Road"            | "Clifton"             | "Bristol"             | "South Glos 61 char lengt" | "BS8 1TG"                | "County must be 60 characters or fewer"                            |
            | "1 Taylor Road"            | "Clifton"             | "Bristol"             | "South Glos"               | "BS8 1TG 61 char length" | "Postcode must be 8 characters or fewer"                           |

# The below examples are for the scenario above and applies for the rows that read as '61 char len'
# Address Line 1 - 61 chars = "1 Taylor Road is an invalid scenario for more than 60 charlen"
# Address Line 2 - 61 chars = "Clifton this is an invalid scenario f or more than 60 char len"
# Town or city - 61 chars = "Bristol this is an invalid scenario for more than 60 char len"
# County - 61 chars = "South Glos is an invalid scenario for more than 60 char lengt"
# Postcode - 61 chars = "BS8 1TG BS8 1TG BS8 1TG BS8 1TG BS8 1TG BS8 1TG BS8 1TG BS8 1"
