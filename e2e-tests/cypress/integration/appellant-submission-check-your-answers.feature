@wip
Feature: A user checks their answers and wants to submit their appeal

  Scenario: The user has valid data and wants to submit their appeal
    Given the user is presented with the answers they had provided
    When the user confirms that they are happy with their answers
    Then the user should be presented with the Terms and Conditions of the service

  Scenario: AC1 - Accessing check your answers from the task list
    Given the completed task list page is displayed
    When "check your answers" is accessed
    Then the appeal information is presented

  Scenario Outline: AC2 - Accessing an appeal section from check your answers
    Given the check your answers page is displayed
    When section <section> is accessed
    Then the <section> is displayed
    Examples:
      | section                 |
      | "who are you"           |
      | "applicant name"        |
      | "your-details"          |
      | "lpa-details"           |
      | "application-number"    |
      | "upload-decision"       |
      | "upload-application"    |
      | "your appeal statement" |
      | "supporting documents"  |
      | "other appeals"         |
      | "site location"         |
      | "site ownership"        |
      | "site access"           |
      | "site access safety"    |

  Scenario: AC3a - Presenting updated sections on your appeal - About you
    Given changes are made for About you section
    When Check Your Answers is presented
    Then the updated values for About you section are displayed
  Scenario: AC3b - Presenting updated sections on your appeal - About the original planning application
    Given changes are made for About the original planning application section
    When Check Your Answers is presented
    Then the updated values for About the original planning application section are displayed
  Scenario: AC3c - Presenting updated sections on your appeal - About your appeal
    Given changes are made for About your appeal section
    When Check Your Answers is presented
    Then the updated values for About your appeal section are displayed
  Scenario: AC3d - Presenting updated sections on your appeal - Visiting the appeal site
    Given changes are made for Visiting the appeal site section
    When Check Your Answers is presented
    Then the updated values for Visiting the appeal site section are displayed


  Scenario: AC4a - Multiple document upload section - multiple documents are correctly displayed
    Given the appeal has more than one other documents
    When Check Your Answers is presented
    Then the multiple other documents are correctly displayed
  Scenario: AC4b - Multiple document upload section - absence of document is correctly displayed
    Given the appeal has no other documents
    When Check Your Answers is presented
    Then the absence of other document is correctly displayed
