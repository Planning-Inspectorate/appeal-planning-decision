Feature: Appeal submission to Horizon - create case for appellant

  As a Planning Inspectorate case worker
  I want an appeal case published in Horizon
  so that I am able to manage the appeal

  @wip
  @ucd-831 @ucd-831-ac1
  Scenario: Appeal information submitted by an Appellant
    Given a prospective appellant has provided appeal information
    When the appeal is submitted
    Then a case is created for the appellant

  @ac-102 @ac-102-ac1
   Scenario: Appeal information submitted by an Agent
     Given an agent has provided appeal information
     When the appeal is submitted
     Then a case is created for the appellant and the agent
