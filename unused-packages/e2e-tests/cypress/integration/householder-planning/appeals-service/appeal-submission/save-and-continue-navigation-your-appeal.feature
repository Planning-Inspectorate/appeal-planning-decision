@wip @has
@UI-ONLY
Feature: Appeal Submission Save and Continue Navigation - Your appeal
As a prospective appellant, I want to be taken through the submission process efficiently
so that I do not get confused.
This feature file covers the navigation between the Your appeal section to the task-list
The navigation does not depend on the status of a sub-section

Scenario: Navigation - Your appeal
  Given the "Appeal statement" is presented
  When the "Appeal statement" is submitted with valid values
  Then the user is navigated to "Supporting documents"

Scenario: Navigation - Supporting documents
  Given the "Supporting documents" is presented
  When the "Supporting documents" is submitted with valid values
  Then the user is navigated to "Appeal tasks"
