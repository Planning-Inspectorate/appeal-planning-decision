@has
Feature: User chooses to provide their planning application number

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario: The user needs to provide their planning application number
    Given the user checks the status of their appeal
    When the user selects to provide their planning application number
    Then the user should be presented with opportunity to provide their planning application number
