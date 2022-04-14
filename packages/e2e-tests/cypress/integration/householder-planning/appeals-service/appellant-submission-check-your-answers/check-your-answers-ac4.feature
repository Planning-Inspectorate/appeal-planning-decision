@has
Feature: A user checks their answers and wants to submit their appeal

  Background:
    Given appellant has completed householder appeal eligibility journey

    ### This has to be tested again once the defect AS-4654 has been fixed
  Scenario: AC4a - Multiple document upload section - multiple documents are correctly displayed
    Given the appeal has more than one other documents
    When Check Your Answers is presented
    Then the multiple other documents are correctly displayed

  Scenario: AC4b - Multiple document upload section - absence of document is correctly displayed
    Given the appeal has no other documents
    When Check Your Answers is presented
    Then the absence of other document is correctly displayed
