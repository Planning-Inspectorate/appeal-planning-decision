@wip @has
@UI-ONLY
Feature: Appeal Submission Save and Continue Navigation - About the appeal site
As a prospective appellant, I want to be taken through the submission process efficiently
so that I do not get confused.
This feature file covers the navigation between the About-the-appeal-site to the task-list
The navigation does not depend on the status of a sub-section

Scenario: Navigation - About the appeal site
  Given the "Site location" is presented
  When the "Site location" is submitted with valid values
  Then the user is navigated to "Site ownership"

Scenario: Navigation - Site ownership with YES selected
  Given the "Site ownership" is presented
  When the "Site ownership" is submitted with a YES value
  Then the user is navigated to "Site access"

Scenario: Navigation - Site ownership with NO selected
  Given the "Site ownership" is presented
  When the "Site ownership" is submitted with a NO value
  Then the user is navigated to "Site ownership certb"

Scenario: Navigation - Site ownership certb with YES selected
  Given the "Site ownership" is not wholly owned
  When the "Site ownership certb" is submitted with a YES value
  Then the user is navigated to "Site access"

Scenario: Navigation - Site ownership certb with NO selected
  Given the "Site ownership" is not wholly owned
  When the "Site ownership certb" is submitted with a NO value
  Then the user is navigated to "Site access"

Scenario: Navigation - Site access with YES selected
  Given the "Site access" is presented
  When the "Site access" is submitted with a YES value
  Then the user is navigated to "Site safety"

Scenario: Navigation - Site access with NO selected
  Given the "Site access" is presented
  When the "Site access" is submitted with a NO value and text about how access is restricted
  Then the user is navigated to "Site safety"

Scenario: Navigation - Site access safety with YES selected
  Given the "Site safety" is presented
  When the "Site safety" is submitted with a YES value and text about health and safety concerns
  Then the user is navigated to "Appeal tasks"

Scenario: Navigation - Site access safety with NO selected
  Given the "Site safety" is presented
  When the "Site safety" is submitted with a NO value
  Then the user is navigated to "Appeal tasks"
