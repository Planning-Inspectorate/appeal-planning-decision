Feature: Appeals Questionnaire Submitted Confirmation
  As a beta LPA, I want confirmation that the LPA Questionnaire has been submitted
  so that I know that the Planning Inspectors have received it

  Background:
    Given an appeal has been created
    And a questionnaire has been created

  Scenario: AC01 - LPA Planning Officer submits finished LPA Questionnaire
    Given the Information Submitted page is requested
    Then the Information Submitted page will be shown
