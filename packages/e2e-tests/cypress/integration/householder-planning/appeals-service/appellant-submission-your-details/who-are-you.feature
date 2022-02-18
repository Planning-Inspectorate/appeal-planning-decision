@wip @has @smoketest
Feature: Confirmation of original applicant
  Note: This feature describes behaviour for a newly created appeal

  @as-1672
  Scenario: No confirmation
    Given confirmation of whether appellant is original applicant is requested
    When confirmation about original applicant is not provided
    Then original applicant status is presented
    And appeal is not updated because confirmation of original applicant status is required
    And Your Details section is "NOT STARTED"

  Scenario: Confirmation provided - is original applicant
    Given confirmation of whether appellant is original applicant is requested
    When confirmation provided that appellant is original applicant
    Then name and email are presented
    And appeal is updated to show appellant is original applicant
    And Your Details section is "IN PROGRESS"

  Scenario: Confirmation provided - is not original applicant
    Given confirmation of whether appellant is original applicant is requested
    When confirmation provided that appellant is not original applicant
    Then name and email are presented
    And appeal is updated to show appellant is not original applicant
    And Your Details section is "IN PROGRESS"

