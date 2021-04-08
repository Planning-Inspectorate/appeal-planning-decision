Feature: Appeals Questionnaire Submitted Confirmation
As a beta LPA, I want confirmation that the LPA Questionnaire has been submitted
so that I know that the Planning Inspectors have received it

Scenario: AC01 - LPA Planning Officer submits finished LPA Questionnaire
Given the Check your Answers page of the LPA Questionnaire is requested
When the questionnaire is submitted
Then a confirmation screen is displayed
