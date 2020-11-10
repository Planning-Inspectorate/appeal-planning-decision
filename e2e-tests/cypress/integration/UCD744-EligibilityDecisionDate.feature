Feature: Navigate to the Eligibility Decision page and verify the content
    I need to provide the date of the decision from the local planning department,
    so that the system can confirm whether my appeal is in time.

    Background: Navigate to Eligibility Decision page
        Given I navigate to the Eligibility checker page
        And I am on the descision date page

    Scenario: Navigate to Eligibility Decision page and verify the content in the page
        Then I can see the logo gov uk text
        And I can see the header link appeal a householder planning decision
        And I can verify the text what is the decision date on the letter
        And I can see the footer

    Scenario Outline: User enters numeric characters in date field
        Then I can see that I am able to enter numeric text in format DDMMYYYY
          And I enter Day as <Day> and Month as <Month> and Year as <Year>

        Examples:
            | Day | Month | Year |
            | 15  | 10    | 2020 |
            | 01  | 01    | 2020 |


    Scenario Outline: Verify the date fields are mandatory
        And I enter Day as <Day> and Month as <Month> and Year as <Year>
        When I click on Continue button
        Then a validation error is displayed

        Examples:
            | Day | Month | Year |
            |     |       |      |
            | aa  | 10    | 2020 |


    Scenario: Verify the link 'I have not received a decision from the local planning department​' is present
        Then I can see the link is displayed
        When I select the link
        Then I am on the not received a decision date page

    Scenario: User selects the back link
        And the Back link is displayed
        When I select the Back link
        Then I am on the previous page
