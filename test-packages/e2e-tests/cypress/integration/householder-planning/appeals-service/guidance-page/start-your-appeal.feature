@wip @has
Feature: Guidance Page - Start your appeal
  As a PO on the appeal service
  I want prospective appellants to be aware of who the service is for
  So that only those who need to appeal through the new appeal service do so

  Scenario: AC1: Appellant starts appeal
    Given the appellant is on the start your appeal page
    When the appellant has selected to start the service
    Then the appellant can begin an appeal
