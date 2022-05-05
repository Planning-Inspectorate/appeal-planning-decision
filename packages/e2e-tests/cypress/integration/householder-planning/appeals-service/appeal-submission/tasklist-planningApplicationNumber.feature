Feature: User chooses to provide their planning application number

  Scenario: The user needs to provide their planning application number
    Given the user checks the status of their appeal
    When the user selects to provide their planning application number
    Then the user should be presented with opportunity to provide their planning application number
