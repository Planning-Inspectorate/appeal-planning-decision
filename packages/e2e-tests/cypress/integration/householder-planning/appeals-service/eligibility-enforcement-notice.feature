@wip @has @smoketest
Feature: A prospective appellant states whether or not they have received an Enforcement Notice
    Our service does not cover appellants who have received an Enforcement Notice

  @ucd-998 @ucd-998-ac2
  Scenario: Prospective appellant makes no selection and is provided an error
    Given receipt of an Enforcement Notice is requested
    When receipt of an Enforcement Notice is not provided
    Then progress is halted with a message that the Enforcement Notice question is required

  @ucd-998 @ucd-998-ac3
  Scenario: Prospective appellant selects no and proceeds through eligibility checker
    Given receipt of an Enforcement Notice is requested
    When the appellant has not received an Enforcement Notice
    Then progress is made to the Listed Building eligibility question

  @ucd-998 @ucd-998-ac4
  Scenario: Prospective appellant selects yes and is taken to kick-out page
    Given receipt of an Enforcement Notice is requested
    When the appellant has received an Enforcement Notice
    Then progress is halted with a message that this service is only for householder planning appeals
