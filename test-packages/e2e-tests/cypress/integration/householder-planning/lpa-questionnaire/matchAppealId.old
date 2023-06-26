@wip
Feature: Associate Appeal ID with a single Reply
  As an LPA Planning Officer
  I want the questionnaire to be linked with a submitted appeal
  So that I can ensure I am giving the information about the correct appeal and when I return to the same questionnaire it presents the previously entered data.

  Background:
    Given an appeal has been created
    And a questionnaire has been created

  Scenario: Viewing saved information
    Given answers have been saved to the questionnaire
    When the questionnaire is revisited in a new session
    Then previously entered data will be visible

  Scenario: Changes made to questionnaire
    Given answers have been saved to the questionnaire
    When the questionnaire is revisited in a new session
    And changes are made to the questions
    Then the changes over write the previously saved answers
