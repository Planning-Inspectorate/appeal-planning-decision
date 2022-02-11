@wip @has
Feature: A user has submitted an appeal and requests a pdf copy of the data entered

  @AS-121
  Scenario: the appellant or agent views the pdf and sees the other owner notification as entered
    Given an agent or appellant has submitted an appeal and they do not wholly own the site
    When the pdf is viewed
    Then the answer for other owner notification is displayed as submitted
