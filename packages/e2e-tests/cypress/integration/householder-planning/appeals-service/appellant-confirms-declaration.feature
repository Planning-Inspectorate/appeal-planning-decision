@has
Feature: Declaration must be agreed before a submission can be made

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario: Prospective appellant does not agree to the declaration
    Given an appeal is ready to be submitted
    When the declaration is not agreed
    Then no submission confirmation is presented

  Scenario: Prospective appellant agree to the declaration
    Given an appeal is ready to be submitted
    When the declaration is agreed
    Then the submission confirmation is presented
