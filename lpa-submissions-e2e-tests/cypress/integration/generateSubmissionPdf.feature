Feature: Creation of a PDF file containing the LPA Questionnaires submission information
  Once a questionnaire has been submitted a PDF version of the check your answers screen is generated.

  Background:
    Given an appeal has been created
    And a questionnaire has been created
    And the LPA Planning Officer is authenticated

    @wip
  Scenario: AC01 - PLA Planing officer submits their answers and pdf should generate
    Given the questionnaire has been completed
    When the LPA Questionnaire is submitted
    Then a PDF of the Check Your Answers page is created
