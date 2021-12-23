@wip
Feature: Appeal submission to Horizon - providing all documentation
  As a case worker
  I want to view the documents associated to an appeal
  So that I can review them


  Scenario: Appeal documentation submitted for case workers to view
    Given documents have been provided as part of an appeal
    When the appeal is submitted
    Then the associated documents will be available for the case worker to review
    And an email notification is sent
