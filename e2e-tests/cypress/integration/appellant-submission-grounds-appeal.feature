Feature: A user supplies an appeal statement
I need to confirm that there is no sensitive data in order to save and continue.

  Scenario: Appeal statement not provided and privacy safety not confirmed
    When I don't provide an appeal statement
    Then I am informed that I have to confirm the privacy safety

  Scenario: Appeal statement provided with bad format and privacy safety not confirmed
    When I provide an appeal statement with a bad format
    Then I am informed that the appeal statement has a wrong format
    And I am informed that I have to confirm the privacy safety

  Scenario: Appeal statement provided with good format but privacy safety not confirmed
    When I provide an appeal statement with a good format
    Then I am informed that I have to confirm the privacy safety

  Scenario: Appeal statement provided with good format and privacy safety is confirmed
    When I provide a valid appeal statement with no sensitive data
    Then I can proceed with the provided appeal statement

