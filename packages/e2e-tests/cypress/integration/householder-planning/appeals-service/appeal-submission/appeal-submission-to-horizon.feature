@wip @has
Feature: Appeal submission to Horizon - create case for appellant

  As a Planning Inspectorate case worker
  I want an appeal case published in Horizon
  so that I am able to manage the appeal

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario: Appeal information submitted by an Appellant
    Given a prospective appellant has provided appeal information
    When the appeal is submitted
    Then a case is created for the appellant

   Scenario: Appeal information submitted by an Agent
     Given an agent has provided appeal information
     When the appeal is submitted
     Then a case is created for the appellant and the agent

  Scenario: LPA receives notification of a new appeal - appellant
    Given a prospective appellant has provided appeal information
    When the appeal is submitted
    Then the LPA will receive an email notification of the appeal

  Scenario: LPA receives notification of a new appeal - agent
    Given an agent has provided appeal information
    When the appeal is submitted
    Then the LPA will receive an email notification of the appeal
