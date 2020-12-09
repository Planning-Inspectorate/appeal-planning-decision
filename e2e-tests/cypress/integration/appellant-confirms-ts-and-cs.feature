@UI-ONLY
Feature: Terms and Conditions must be accepted before a submission can be made

  Scenario: Prospective appellant does not accept the Terms and Conditions
    When the user "does not accept" the terms and conditions
    Then the user is informed that they must accept the terms and conditions to proceed
    And the appeal "is not" submitted

  Scenario: Prospective appellant accepts the Terms and Conditions
    When the user "accepts" the terms and conditions
    Then the appeal "is" submitted
