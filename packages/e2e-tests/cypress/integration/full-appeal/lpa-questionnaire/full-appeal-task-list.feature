Feature: Full appeal task list

  Scenario: AC-01 Appeal details in context of questionnaire
    Given the LPA has received a link for a full appeal questionnaire
    When the LPA accesses the link to the questionnaire
    Then the appeal details are displayed on the right side panel

  Scenario: AC2 - Task list - Determination
    Given an appeal has been submitted after a decision letter has been received
    And the LPA has received a link for the full appeal questionnaire
    When the LPA accesses the link to the questionnaire
    Then the deterministic tasks are presented each with a “Not Started“ status

  Scenario: AC3 - Task list - Non-determination
    Given an appeal has been submitted before a decision letter has been received
    And the LPA has received a link for the full appeal questionnaire
    When the LPA accesses the link to the questionnaire
    Then the non-deterministic tasks are presented each with a “Not Started“ status

   Scenario: AC 4 - Task list - Check your answers
     Given the LPA has received a link for a full appeal questionnaire
     When the LPA accesses the link to the questionnaire
     Then the task Check your answers and submit has a status of "Cannot start yet"
