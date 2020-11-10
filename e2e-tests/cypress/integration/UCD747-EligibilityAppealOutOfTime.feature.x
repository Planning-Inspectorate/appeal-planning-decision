Feature: User Appeals out of Time
    As a prospective appellant, I need the system to confirm that my appeal is out of time, so that I don't  proceed with my appeal and I understand my options.

    Background: Navigate to Eligibility Decision page and verify the content
        Given I navigate to the Eligibility checker page
        And I am on the descision date page

    @Smoke @Regression
    #Also in US765, 746 - 12 weeks +1 day or more (chk with daisy to update AC)
    Scenario Outline: User enter a date in a valid format but out of appeal time
        Given I navigate to the Eligibility checker page
        And I am on the descision date page
        When I enter Day as "<Day>" in the day field
        And I enter Month as "<Month>" in the month field
        And I enter Year as "<Year>" in the year field
        And I click on Continue button
        Then I am on the next page the deadline for appeal has passed
        And I can see the deadline date is displayed

        Examples:
            | Day | Month | Year |
            | 08  | 08    | 2020 |
            | 01  | 01    | 2020 |

    Scenario: User selects the back link
        Given I navigate to the Eligibility checker page
        And I am on the descision date page
        And the Back link is displayed
        When I select the Back link
        Then I am on the previous page