Feature: Session Handling and association with an appeal
  As an LPA Planning Officer
  I want the questionnaire to be linked with a submitted appeal
  So that I can ensure I am giving the information about the correct appeal and when I return to the same questionnaire it presents the previously entered data.

  @as-1903 @as-1903-AC1
  Scenario: Viewing saved information
    Given all the mandatory questions for the questionnaire have been completed
    When the questionnaire is revisited in a new session
    Then previously entered data will be visible

  @as-1903 @as-1903-AC2
  Scenario: Changes made to questionnaire
    Given all the mandatory questions for the questionnaire have been completed
    When changes are made in a new session
    Then the changes over write the previously saved answers
