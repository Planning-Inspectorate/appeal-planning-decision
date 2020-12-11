Feature: A user checks their answers and wants to submit their appeal

  Scenario: The user has valid data and wants to submit their appeal
    Given the user is presented with the answers they had provided
    When the user confirms that they are happy with their answers
    Then the user should be presented with the Terms and Conditions of the service
