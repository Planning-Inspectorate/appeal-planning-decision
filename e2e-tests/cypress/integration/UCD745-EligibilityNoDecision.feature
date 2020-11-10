Feature: Don't have a decision from the local planning department
  As a prospective appellant, I need to state if I don't have a decision from my local planning department, so that I don't proceed with the eligibility checker and am shown my options.

  # Background: Navigate to Eligibility Decision page
  #   Given I navigate to the Eligibility checker page
  #   And I am on the descision date page


  Scenario: Navigate to I have not received a Decision page and verify the content in the page
    Given I navigate to not received a decision page
    Then I can see the logo gov uk text
    And I can see the header link appeal a householder planning decision
    And I can see the text This service is only for householder planning applications
    And I can see the footer

  # Scenario: User selects the link 'I have not received a decision'
  #   Then I can see the link I have not received a decision from the local planning dept is displayed
  #   When I select the link
  #   Then I am on the page this service is only for householder planning applications
  #   And I can see the header link appeal a householder planning decision
  #   And I can see the text
  #   And I can see the link Appeal a Planning Decision service is displayed
  #   And I can see the footer


  Scenario: User selects Appeal a Planning Decision service link
    Given I navigate to not received a decision page
    And I can see the text This service is only for householder planning applications
    And I can see the link Appeal a Planning Decision service
  #Then the link url should be equal to Appeals Casework Portal page
  # Cypress issue with navigating to a different domain in the same test is not possible, so the next scenario is to show we can navigate to the case portal page
  #Then I am on the Appeals Casework Portal page

  Scenario: User navigate to Appeals Casework Portal page
    Given I am on the Appeals Casework Portal page
    Then I can see the LogIn or Register fields

# Scenario: User selects the link Appeal a Planning Decision service
#   Then I can see the link I have not received a decision from the local planning dept is displayed
#   When I select the link
#   Then I am on the page This service is only for householder
#   And I see the text
#   And I can see the link Appeal a Planning Decision service is displayed
#   When I select the link Appeal a Planning Decision service
#   Then I am taken to Appeals Casework Portal page


# NOT YET READY -> feedback links, footer links
# Scenario: User selects the back link
#   And the Back link is displayed
#   When I select the Back link
#   Then I am on the previous page
