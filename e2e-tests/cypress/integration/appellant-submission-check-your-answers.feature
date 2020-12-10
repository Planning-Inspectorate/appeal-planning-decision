@wip
Feature: A user checks their answers and wants to submit their appeal

  Scenario: The user has valid data and wants to subnit their appeal
    Given the user "has" provided enough data to submit an appeal
    When the user confirms that they are happy with their answers
    Then the user is asked to agree to the Terms and Conditions of the service


  Scenario: The user has invalid data and wants to subnit their appeal
    Given the user "has not" provided enough data to submit an appeal
    When the user checks their answers
    Then the user is not offered the chance to submit their appeal
