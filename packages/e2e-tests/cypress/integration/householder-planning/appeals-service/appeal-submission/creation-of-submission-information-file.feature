@has
Feature: Appeal Submission - Creation of submission information file

  As a Planning Inspectorate case worker
  I want a human readable file containing the appellant’s appeal submission information, at point of submission
  So that I have all the information collected during the appeal submission that was not explicitly passed to Horizon

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario: Summary of submission
    Given a prospective appellant has provided valid appeal information
    When the appeal is submitted
    Then a submission information file is created
    And the cookie banner does not exist
