@wip @has
Feature: A user checks their answers and wants to submit their appeal

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario: The user has valid data and wants to submit their appeal
    Given the user is presented with the answers they had provided
    When the user confirms their answers
    Then the user should be presented with the Terms and Conditions of the service

  Scenario: AC1 - Accessing check your answers from the task list
    Given the completed task list page is displayed
    When Check Your Answers is accessed
    Then the appeal information is presented
