Feature: Appeals Questionnaire Submitted Confirmation
As a beta LPA, I want confirmation that the LPA Questionnaire has been submitted
so that I know that the Planning Inspectors have received it

Scenario: AC01 - LPA Planning Officer submits finished LPA Questionnaire
Given the Information Submitted page is requested
Then the Information Submitted page will be shown
Then the LPA email address is displayed on the Information Submitted page

Scenario: AC02 - LPA Planning Officer submits finished LPA Questionnaire but email recall fails
Given the Information Submitted page is requested
Then the Information Submitted page will be shown
Then the LPA email address is not displayed on the Information Submitted page
