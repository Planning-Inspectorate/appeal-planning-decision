Feature: Don't have a decision from the local planning department
  As a prospective appellant, I need to state if I don't have a decision from my local planning department, so that I don't proceed with the eligibility checker and am shown my options.

  Scenario: Navigate to I have not received a Decision page and verify the content in the page
    Given I navigate to not received a decision page
    Then I can see the logo gov uk text
    And I can see the header link appeal a householder planning decision
    And I can see the text This service is only for householder planning applications
    And I can see the footer

  Scenario: User selects Appeal a Planning Decision service link
    Given I navigate to not received a decision page
    And I can see the text This service is only for householder planning applications
    And I can see the link Appeal a Planning Decision service

  Scenario: User navigate to Appeals Casework Portal page
    Given I am on the Appeals Casework Portal page
    Then I can see the LogIn or Register fields
