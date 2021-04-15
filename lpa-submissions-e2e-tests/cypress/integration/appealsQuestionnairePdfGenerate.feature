@wip
Feature: Creation of a PDF file containing the LPA Questionnaires submission information
  As a beta LPA Planning Officer
  I submit LPA Questionnaires then PDF file should be generated

Scenario: AC01 - PLA Planing officer submits their answers and pdf should generate
  Given a LPA Planning Officer has completed their reply
  When anwers are submited
  Then is is confirmed that the answers have been successfully submitted
  And the summary of pdf can be downloaded 




