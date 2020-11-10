Feature: User Appeals in Time
    As a prospective appellant, I need the system to confirm that my appeal is in time, so that I can proceed with my appeal

    Background: Navigate to Eligibility Decision page and verify the content
        Given I navigate to the Eligibility checker page
        And I am on the descision date page

    @Smoke @Regression
    #Also in US765 - 12 weeks +1 day or 0 day(check with Daisy)
    # Todo need to write date calucation function for this
    Scenario Outline: User enter a valid date that is within the appeal time
        Given I navigate to the Eligibility checker page
        And I am on the descision date page
        When I enter Day as "<Day>" in the day field
        And I enter Month as "<Month>" in the month field
        And I enter Year as "<Year>" in the year field
        And I click on Continue button
        Then I am the next page

        Examples:
            | Day | Month | Year |
            | 10  | 10    | 2020 |
            | 09  | 08    | 2020 |


    Scenario: User selects the back link
        Given I navigate to the Eligibility checker page
        And I am on the descision date page
        And the Back link is displayed
        When I select the Back link
        Then I am on the previous page