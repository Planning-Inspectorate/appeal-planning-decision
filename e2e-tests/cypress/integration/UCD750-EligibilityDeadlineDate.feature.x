Feature:
    As a prospective appellant who has been told that my deadline for appeal has passed,
    I need to understand when that date was, so that it is clear to me I can not proceed.

    Background: Navigate to Eligibility Decision page
        Given I navigate to the Eligibility checker page
        And I am on the descision date page

      #the below date will be calculated as today's date minus 12 weeks
    Scenario: The deadline for appeal has passed the user input date
        When I enter Day as 31 and Month as 10 and Year as 2020
        And I click on Continue button
        Then I am on The deadline for appeal has passed page
        And I can see The deadline date

    Scenario: User selects the link guidance on householder planning appeals
        When I enter Day as "<10>" and Month as "<01>" and Year as "<2020>"
        And I click on Continue button
        Then I am on page The deadline for appeal has passed
        When I select the link guidance on householder planning appeals
        Then I am on the gov uk website Appeal a householder planning descision

      Scenario: User selects the back link
        And the Back link is displayed
        When I select the Back link
        Then I am on the descision date page

