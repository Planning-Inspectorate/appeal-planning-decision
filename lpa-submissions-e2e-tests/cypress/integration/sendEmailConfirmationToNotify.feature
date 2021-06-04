Feature: As a planning officer
  I want to receive confirmation by email that the LPA questionnaire has been submitted
  So that we have a copy for our records

  Scenario: AC01 Send email confirmation to LPA
    Given the questionnaire for appeal "15549118-106f-4394-95c6-c63887b7d4c9" has been completed
    When the LPA Questionnaire for appeal "15549118-106f-4394-95c6-c63887b7d4c9" is submitted
    Then a confirmation email is sent to the LPA
