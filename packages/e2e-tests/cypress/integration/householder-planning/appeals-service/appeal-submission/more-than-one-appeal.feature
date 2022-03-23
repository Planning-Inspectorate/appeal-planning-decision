@wip @has
Feature: As an appellant or agent using the appeals service
  I need to be able to submit more than one appeal
  So that I can create all the appeals I need

  Scenario: AC1: Appellant to be able to create more than 1 appeal
    Given an appellant has successfully submitted an appeal
    When the appellant starts a new appeal
    Then the appellant is able to create a new appeal without any error message

  Scenario: AC2: Agent to be able to create more than 1 appeal
    Given an agent has successfully submitted an appeal
    When the agent starts a new appeal
    Then the agent is able to create a new appeal without any error message

