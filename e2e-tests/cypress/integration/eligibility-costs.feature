Feature: Claiming for Costs eligibility check
  Note: Appeals that include claiming for Costs are not supported.

  Scenario: Not claiming for Costs allows progress
    Given an answer to the Costs question is requested
    When not claiming Costs is confirmed
    Then progress is made to the 'Your appeal statement'

  Scenario: Claiming for Costs prevents progress
    Given an answer to the Costs question is requested
    When claiming for Costs is confirmed
    Then progress is halted with a message that claiming for Costs is not supported

  Scenario: Failure to answer the Costs question prevents progress
    Given an answer to the Costs question is requested
    When the Costs question is not answered
    Then progress is halted with a message that an answer to the Costs question is required

  Scenario: Accessing Costs guidance
    Given an answer to the Costs question is requested
    When guidance is accessed
    Then guidance is presented while an answer to the Costs question is still requested

  Scenario: Accessing ACP
    Given an answer to the Costs question is requested
    When claiming for Costs is confirmed
    Then access is available to ACP
