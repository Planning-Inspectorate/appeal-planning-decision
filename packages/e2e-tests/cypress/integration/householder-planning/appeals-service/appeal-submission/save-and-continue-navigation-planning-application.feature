@has
@UI-ONLY
Feature: Appeal Submission Save and Continue Navigation - About the Original Planning Application
As a prospective appellant, I want to be taken through the submission process efficiently
so that I do not get confused.
This feature file covers the navigation between the Planning Application section to the task-list
The navigation does not depend on the status of a sub-section

Scenario: Navigation - Planning Application number
  Given the "Application number" is presented
  When the "Application number" is submitted with valid values
  Then the user is navigated to "Upload application"

  Scenario: Navigation - Upload application
  Given the "Upload application" is presented
  When the "Upload application" is submitted with valid values
  Then the user is navigated to "Upload decision letter"

Scenario: Navigation - Upload decision letter
  Given the "Upload decision letter" is presented
  When the "Upload decision letter" is submitted with valid values
  Then the user is navigated to "Appeal tasks"
