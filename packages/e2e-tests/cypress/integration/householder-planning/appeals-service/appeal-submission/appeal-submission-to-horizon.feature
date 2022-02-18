@wip @has
Feature: Appeal submission to Horizon - create case for appellant

  As a Planning Inspectorate case worker
  I want an appeal case published in Horizon
  so that I am able to manage the appeal

  @ucd-831 @ucd-831-ac1
  Scenario: Appeal information submitted by an Appellant
    Given a prospective appellant has provided appeal information
    When the appeal is submitted
    Then a case is created for the appellant

  @as-102 @as-102-ac1
   Scenario: Appeal information submitted by an Agent
     Given an agent has provided appeal information
     When the appeal is submitted
     Then a case is created for the appellant and the agent

  @as-1864 @as-1864-ac1-1
  Scenario: LPA receives notification of a new appeal - appellant
    Given a prospective appellant has provided appeal information
    When the appeal is submitted
    Then the LPA will receive an email notification of the appeal

  @as-1864 @as-1864-ac1-2
  Scenario: LPA receives notification of a new appeal - agent
    Given an agent has provided appeal information
    When the appeal is submitted
    Then the LPA will receive an email notification of the appeal
