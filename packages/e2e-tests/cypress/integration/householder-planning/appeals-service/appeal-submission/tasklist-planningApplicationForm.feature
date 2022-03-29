@has
Feature: User chooses to provide their appeal submission document

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario: The user needs to provide their appeal submission document
    Given the user checks the status of their appeal
    When the user selects to upload their appeal submission document
    Then the user should be presented with opportunity to upload their appeal submission document
