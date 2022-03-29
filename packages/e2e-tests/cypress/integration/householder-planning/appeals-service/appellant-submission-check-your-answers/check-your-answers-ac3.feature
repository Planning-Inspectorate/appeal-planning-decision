@has
Feature: A user checks their answers and wants to submit their appeal

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario: AC3a - Presenting updated sections on your appeal - 'About you'
    Given changes are made for About you section
    When Check Your Answers is presented
    Then the updated values for About you section are displayed

  Scenario: AC3b - Presenting updated sections on your appeal - 'About the original planning application'
    Given changes are made for About the original planning application section
    When Check Your Answers is presented
    Then the updated values for About the original planning application section are displayed

  Scenario: AC3c - Presenting updated sections on your appeal - 'About your appeal'
    Given changes are made for About your appeal section
    When Check Your Answers is presented
    Then the updated values for About your appeal section are displayed

  Scenario: AC3d - Presenting updated sections on your appeal - 'Visiting the appeal site'
    Given changes are made for Visiting the appeal site section
    When Check Your Answers is presented
    Then the updated values for Visiting the appeal site section are displayed
