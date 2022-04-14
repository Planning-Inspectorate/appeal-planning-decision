@has
Feature: A user checks their answers and wants to submit their appeal

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario: Change link navigates to the other owner notification page
    Given an agent or appellant has provided information where they have not informed the other owners
    When Check Your Answers is presented
    And agent or appellant decide to change their other owner notification answer from no to yes
    Then the positive answer for other owner notification is displayed with a change link
