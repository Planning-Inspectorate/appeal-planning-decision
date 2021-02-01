Feature: A user checks their answers and wants to submit their appeal

  Scenario: The user has valid data and wants to submit their appeal
    Given the user is presented with the answers they had provided
    When the user confirms their answers
    Then the user should be presented with the Terms and Conditions of the service

  Scenario: AC1 - Accessing check your answers from the task list
    Given the completed task list page is displayed
    When Check Your Answers is accessed
    Then the appeal information is presented

  Scenario Outline: AC2a - Accessing an appeal section from check your answers
    Given the check your answers page is displayed for Person Appealing is Original Applicant
    When section <section> is accessed
    Then the <section> is displayed
    Examples:
      | section                                         |
      | "About you - Who are you Section"               |
      | "About you - Your details Section"              |
      | "Planning application - Application number"     |
      | "Planning application - Upload application"     |
      | "Planning application - Upload decision letter" |
      | "Your appeal - Appeal statement"                |
      | "Your appeal - Supporting documents"            |
      | "Appeal site - Site location"                   |
      | "Appeal site - Site ownership"                  |
      | "Appeal site - Site access"                     |
      | "Appeal site - Site safety"                     |

  Scenario Outline: AC2b - Accessing an appeal section from check your answers
    Given the check your answers page is displayed for Person Appealing is not Original Applicant
    When section <section> is accessed
    Then the <section> is displayed
    Examples:
      | section                                         |
      | "About you - Who are you Section"               |
      | "About you - Your details Section"              |
      | "About you - Appealing of behalf of Section"    |

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

