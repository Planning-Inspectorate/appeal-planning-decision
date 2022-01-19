
Feature: The Decision Date page has the right structure
    I need to provide the date of the decision from the local planning department,
    so that the system can confirm whether my appeal is in time.

    Scenario: Navigate to Eligibility Decision page and verify the content in the page
        Given I navigate to the Eligibility checker page
        And I am on the decision date page
        Then I can see the logo gov uk text
        And I can see the header link appeal a planning decision
        And I can verify the text what is the decision date on the letter
        And I can see the footer

# -> abstract language re: when i want to review my last piece of data then i can easily
    Scenario: User selects the back link
        Given I navigate to "eligibility/planning-department"
        And I navigate to the Eligibility checker page
        When I select the Back link
        Then I am on "/eligibility/planning-department"
