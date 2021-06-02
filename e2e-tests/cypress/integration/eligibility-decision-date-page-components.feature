
Feature: The Decision Date page has the right structure
    I need to provide the date of the decision from the local planning department,
    so that the system can confirm whether my appeal is in time.

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

# -> abstract language re: when i want to review my last piece of data then i can easily
    Scenario: User selects the back link
        Given I navigate to "/eligibility/planning-department"
        And I navigate to the Eligibility checker page
        When I select the Back link
        Then I am on "/eligibility/planning-department"

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

