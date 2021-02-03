@smoketest
@wip
Feature: A prospective appellant states whether or not they have received an Enforcement Notice
    Our service does not cover appellants who have received an Enforcement Notice

  Scenario: Enforcement Notice question is required
    Given receipt of an Enforcement Notice is requested
    When receipt of an Enforcement Notice is not provided
    Then progress is halted with a message that the Enforcement Notice question is required

  Scenario: Enforcement Notice has been received
    Given receipt of an Enforcement Notice is requested
    When the appellant has received an Enforcement Notice
    Then progress is halted with a message that this service is only for householder planning appeals

  Scenario: Enforcement Notice has not been received
    Given receipt of an Enforcement Notice is requested
    When the appellant has not received an Enforcement Notice
    Then progress is made to the Listed Building eligibility question
