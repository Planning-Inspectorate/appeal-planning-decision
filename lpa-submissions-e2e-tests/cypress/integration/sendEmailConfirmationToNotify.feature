Feature: As a LPA
I want to receive confirmation by email that the LPA questionnaire has been submitted
So that we have a copy for our records

Scenario: AC01 Send email confirmation to LPA
Given the questionnaire has been completed
When the LPA Questionnaire is submitted
Then a confirmation email is sent to the LPA
