@wip
Feature: Creation of a PDF file containing the LPA Questionnaires submission information
  As a beta LPA Planning Officer
  I submit LPA Questionnaires then PDF file should be generated

Scenario: AC1 LPA Planning Officer must be able to view Pdf fie when  the LPA Questionnaires is submitted
    Given Check Your Answers is presented
    When  The answers are submitted
    Then  A PDF of the Check Your Answers page is created

  Scenario: AC2 LPA Planning Officer must be able to view the title of the page 
    Given  Check Your Answers is presented
    When   The answers are submitted
    And    A PDF of the Check Your Answers page is created
    When    Verify page title

Scenario: AC3 LPA Planning Officer must be able to view the submitted date on Pdf page 
    Given  Check Your Answers is presented
    When   The answers are submitted
    And    A PDF of the Check Your Answers page is created
    Then   Submitted date should be displayed
@focus 
Scenario: AC4 LPA Planning Officer must be able to view the Planning application number on Pdf page 
    Given  Check Your Answers is presented
    When   The answers are submitted
    And    A PDF of the Check Your Answers page is created
    Then   Planning application number should be displayed
@focus 
  Scenario: AC4 LPA Planning Officer must be able to view the name on Pdf page 
    Given  Check Your Answers is presented
    When   The answers are submitted
    And    A PDF of the Check Your Answers page is created
    Then   Name should be displayed

    Scenario: AC4 LPA Planning Officer must be able to view the site address  on Pdf page 
    Given  Check Your Answers is presented
    When   The answers are submitted
    And    A PDF of the Check Your Answers page is created
    Then   Site address should be displayed





