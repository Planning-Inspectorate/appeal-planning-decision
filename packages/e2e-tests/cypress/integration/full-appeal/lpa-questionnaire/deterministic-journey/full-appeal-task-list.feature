@wip
Feature: Full appeal task list

  Background:
    Given a deterministic full appeal has been created

#  remove tag and test when application number is passed to the full-appeal
  @wip
  Scenario: AC-01 Appeal details in context of questionnaire
    Given the LPA accesses the link to the deterministic questionnaire
    Then the appeal details are displayed on the right side panel

  Scenario: AC-02 - Task list - Determination
    Given the LPA accesses the link to the deterministic questionnaire
    Then the deterministic tasks are presented with a 'Not Started' status

   Scenario: AC-03 - Task list - Check your answers
     Given the LPA accesses the link to the deterministic questionnaire
     Then the deterministic task Check your answers has a status of 'Cannot start yet'
