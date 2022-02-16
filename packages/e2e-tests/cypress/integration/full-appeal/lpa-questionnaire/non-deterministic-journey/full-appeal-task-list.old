@wip
Feature: Full appeal non deterministic task list

  Background:
    Given a non-deterministic full appeal has been created

#  remove tag and test when application number is passed to the full-appeal
  @wip
  Scenario: AC-01 Appeal details in context of questionnaire
    Given the LPA accesses the link to the non-deterministic questionnaire
    Then the appeal details are displayed on the right side panel

  Scenario: AC02 - Task list - Non-determination
    Given the LPA accesses the link to the non-deterministic questionnaire
    Then the non-deterministic tasks are presented with a 'Not Started' status

  Scenario: AC03 - Task list - Check your answers
    Given the LPA accesses the link to the non-deterministic questionnaire
    Then the non-deterministic task Check your answers has a status of 'Cannot start yet'
