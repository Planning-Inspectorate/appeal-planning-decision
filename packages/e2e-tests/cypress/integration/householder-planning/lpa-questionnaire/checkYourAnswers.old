@wip
Feature: Check Your Answers
  As an LPA Planning Officer
  I want to be able to review my answers
  So that I can check that the information is accurate and make changes if needed

  Allows an LPA can view the answers and documents that they have entered onto the questionnaire before they submit the details.
  The user can also change their answers from this page.

  The user will only be able to access the Check Your Answers page when all mandatory sections are completed.

  Background:
    Given an appeal has been created
    And a questionnaire has been created

  Scenario: AC01 - Accessing 'Check Your Answers' from the task list
    Given all the mandatory questions for the questionnaire have been completed
    And a LPA Planning Officer is reviewing their LPA Questionnaire task list
    Then Check Your Answers sub section has a status of NOT STARTED
    And the LPA is able to proceed to Check Your Answers

  Scenario: AC02 - Display 'Check Your Answers' page
    When Check Your Answers page is displayed
    Then a summary of questions and answers is provided

  Scenario: AC03 - Submit answers
    Given Check Your Answers is presented for LPA Questionnaire
    When the answers are completed
    Then progress is made to the submission confirmation page

  Scenario: AC04 - Back Link
    Given Check Your Answers is presented for LPA Questionnaire
    When the LPA Planning Officer selects a question
    And the LPA Planning Officer chooses to go to the previous page
    Then user is returned to the Check your answers page
