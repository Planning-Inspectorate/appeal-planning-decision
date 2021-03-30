Feature: A user checks their answers and wants to submit their appeal

  Scenario: The user has valid data and wants to submit their appeal
    Given the user is presented with the answers they had provided
    When the user confirms their answers
    Then the user should be presented with the Terms and Conditions of the service

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
