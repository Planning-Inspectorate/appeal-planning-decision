Feature: pdf
  i want to be able to make a pdf of an appeal

Scenario: When mandatory tasks are completed, then Check your answers task is available
  Given mandatory tasks are completed
  When the appeal tasks are presented
  Then I can make a pdf of my appeal
