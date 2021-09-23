Feature: Eligibility - Appeal Householder Planning Permission Status Question
    Prospective appellant states whether their planning permission application has been Granted, or Refused,
    or they don't have received the decision yet

  Scenario: Prospective appellant selects Refused Householder Planning Permission Status and proceeds through to Decision Date page
    Given Householder Planning Permission Status is requested
    When Householder Planning Permission Status is set to Refused
    Then progress is made to the eligibility Decision Date question

  Scenario: Prospective appellant does not select any Householder Planning Permission Status and is provided an error
    Given Householder Planning Permission Status is requested
    When No Householder Planning Permission Status is not selected
    Then Progress is halted with a message that a Householder Planning Permission Status is required

  Scenario: Prospective appellant selects Granted Householder Planning Permission Status and is taken to kick-out page
    Given Householder Planning Permission Status is requested
    When Householder Planning Permission Status is set to Granted
    Then User is navigated to kick-out page

  Scenario: Prospective appellant selects 'I have not received a decision' Householder Planning Permission Status and is taken to no-decision page
    Given Householder Planning Permission Status is requested
    When Householder Planning Permission Status is set to I have not received a decision
    Then User is navigated to no-decision page    