@wip
Feature: Email confirmation
  As a prospective appellant I want to receive confirmation of my appeal by email so that I have a copy for my records

  Scenario: Send email confirmation to appellant
    Given an appellant has submitted an appeal
    When  the appeal is submitted
    Then a confirmation email is sent to the appellant


  Scenario: Send email confirmation to agent
    Given an agent has submitted an appeal
    When  the appeal is submitted
    Then a confirmation email is sent to the agent
