@wip @has
Feature: Submit an appeal using the System Test Borough Council LPA
  To be able to verify the deployment of the application to production we need the ability
   to submit an appeal and create a case for it in Horizon with no negative impact

  @as-1576
  Scenario: Appeal submission using the System Test Borough Council LPA as local planning department
    Given an appeal is ready to be submitted with System Test Borough Council LPA
    When the declaration is agreed
    Then the submission confirmation is presented
