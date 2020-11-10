Feature: Date Validation in the Eligibility Decision page
    As a user, I need to enter valid date into the eligibility checker,
    so that the system can inform me whether or not I can proceed

    Background: Navigate to Eligibility Decision page and verify the content
        Given I navigate to the Eligibility checker page
        And I am on the descision date page


    # This scenario is also in US746 - 12 weeks +1 day
    Scenario: User enter the past date in a valid format will then proceed through eligibility checker routing
        Given I navigate to the Eligibility checker page
        And I am on the descision date page
        When I enter Day as "31" in the day field
        And I enter Month as "10" in the month field
        And I enter Year as "2020" in the year field
        And I click on Continue button
        Then I am the next page

    @Smoke @Regression
    Scenario Outline: User enters the incorrect date
        Given I navigate to the Eligibility checker page
        And I am on the descision date page
        When I enter Day as "<Day>" and Month as "<Month>" and Year as "<Year>"
        And I click on Continue button
        Then a validation error is displayed "<Error Message>" and I am on the same page

        Examples:
            | Day | Month | Year | Error Message                      |
            |     |       |      | You need to provide a valid date   |
            | 32  | 13    | 1000 | You need to provide a valid date   |
            | 10  | 10    | 1000 | You need to provide a valid date   |
            | 1a  | 0b    | 2cde | Please match the requested format. |
            | 1y  | 10    | 2020 | Please match the requested format. |
            | 31  | zz    | 2020 | Please match the requested format. |
            | 31  | 10    | aaaa | Please match the requested format. |
            | qq  | rr    | ssss | Please match the requested format. |
            | 01  | 10    | 2050 | You need to provide a valid date   |



    Scenario: User selects the back link
        Given I navigate to the Eligibility checker page
        And I am on the descision date page
        And the Back link is displayed
        When I select the Back link
        Then I am on the previous page