Feature: Navigate to the Eligibility Decision page and verify the content
    I need to provide the date of the decision from the local planning department,
    so that the system can confirm whether my appeal is in time.

    Background: Navigate to Eligibility Decision page

    Scenario: Navigate to Eligibility Decision page and verify the content in the page
        Given I navigate to the Eligibility checker page
        And I am on the decision date page
        Then I can see the logo gov uk text
        And I can see the header link appeal a householder planning decision
        And I can verify the text what is the decision date on the letter
        And I can see the footer

    Scenario: Verify the link 'I have not received a decision from the local planning department​' is present
        Given I navigate to the Eligibility checker page
        And I am on the decision date page
        Then I can see the link is displayed
        When I select the link
        Then I am on the not received a decision date page

    Scenario: User selects the back link
        Given I navigate to "/eligibility/planning-department"
        And I navigate to the Eligibility checker page
        When I select the Back link
        Then I am on "/eligibility/planning-department"


    Scenario Outline: Dates older than 12 weeks cannot proceed
        Given I navigate to the Eligibility checker page
        And I am on the decision date page
        When I enter today minus <x> days
        And I click on Continue button
        Then I am on <ExpectedURL>

        Examples:
            | x  | ExpectedURL                        |
            | 84 | "/eligibility/planning-department" |
            | 85 | "/eligibility/decision-date"       |

    Scenario Outline: User enters the valid decision date and can proceed through eligibility checker
        Given I navigate to the Eligibility checker page
        And I am on the decision date page
        When I enter Day as <Day> and Month as <Month> and Year as <Year>
        And I click on Continue button
        Then I am the local planning department page

        Examples:
            | Day   | Month   | Year   |
            | "01"  | "11"    | "2020" |

    Scenario Outline: User enter the past date in a valid format and can proceed through eligibility checker
        Given I navigate to the Eligibility checker page
        And I am on the decision date page
        When I enter Day as <Day> and Month as <Month> and Year as <Year>
        And I click on Continue button
        Then I am the deadline for appeal has passed page

        Examples:
            | Day   | Month   | Year   |
            | "01"  | "01"    | "2020" |
            | "11"  | "11"    | "1010" |
            | "08"  | "08"    | "2020" |

    Scenario Outline: User enters the incorrect date
        Given I navigate to the Eligibility checker page
        And I am on the decision date page
        When I enter Day as <Day> and Month as <Month> and Year as <Year>
        And I click on Continue button
        Then a validation <ErrorMessage> is displayed and I am still on the Eligibility checker page

        Examples:
            | Day   | Month | Year   | ErrorMessage                 |
            | ""    | ""    | ""     | "You need to provide a date" |
            | "31"  | "12"  | "2050" | "You need to provide a date" |
            | "32"  | "12"  | "2020" | "You need to provide a date" |
            | "25"  | "13"  | "2020" | "You need to provide a date" |
            | "32"  | "13"  | "2020" | "You need to provide a date" |
            | "1a"  | "0b"  | "2cde" | "You need to provide a date" |
            | "aa"  | "10"  | "2020" | "You need to provide a date" |
            | "aa"  | "bb"  | "2020" | "You need to provide a date" |
            | "31"  | "zz"  | "2020" | "You need to provide a date" |
            | "31"  | "10"  | "aaaa" | "You need to provide a date" |
            | "qq"  | "rr"  | "ssss" | "You need to provide a date" |
            | "19"  | "10"  | "20"   | "You need to provide a date" |


    Scenario: Navigate to I have not received a Decision page and verify the content in the page
        Given I navigate to not received a decision page
        Then I can see the logo gov uk text
        And I can see the header link appeal a householder planning decision
        And I can see the text This service is only for householder planning applications
        And I can see the footer

    Scenario: User selects the link 'I have not received a decision'
       Given I navigate to the Eligibility checker page
       When I select the I have not received a decision from the local planning dept link
       Then I am on "/eligibility/no-decision"
       And I can see the header link appeal a householder planning decision
       And I can see the text This service is only for householder planning applications
       And I can see the link Appeal a Planning Decision service and it links to "https://acp.planninginspectorate.gov.uk/"
       And I can see the footer
