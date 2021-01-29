@wip
Feature: Task lists
  As a beta LPA I want to clearly see which sections of the
  appeal submission I have completed, so that I do not waste my time checking.

  All the tasks should be "NOT STARTED"

  The "Check your answer" task state should be "CANNOT START YET"

  Scenario Outline: When the tasks are presented, then user should be able to select them
    Given the Householder planning appeal questionnaire page is presented
    Then the task <task> is available for selection
    And The page title of the page is "Householder planning appeal questionnaire - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK"
    Examples:
      | task                                                                              |
      | "About the appeal - Review accuracy of the appellant's submission"                |
      | "About the appeal - Do you have any extra conditions?"                            |
      | "About the appeal - Tell us about any appeals in the immediate area"              |
      | "About the appeal site - Tell us about the appeal site"                           |
      | "Required documents - Upload the plans used to reach the decision"                |
      | "Required documents - Upload the Planning Officer's report"                       |
      | "Optional supporting documents - Telling interested parties about the application"|
      | "Optional supporting documents - Representations from interested parties"         |
      | "Optional supporting documents - Notifying interested parties of the appeal"      |
      | "Optional supporting documents - Site notices"                                    |
      | "Optional supporting documents - Planning history"                                |
      | "Optional supporting documents - Statutory development plan policy"               |
      | "Optional supporting documents - Other relevant policies"                         |
      | "Optional supporting documents - Supplementary planning document extracts"        |
      | "Optional supporting documents - Development Plan Document or Neighbourhood Plan" |


  Scenario Outline: When the lpa questionnaire is not started, then the tasks are in "NOT STARTED" state
    Given the Householder planning appeal questionnaire page is presented
    Then the state for <task> is displayed to be "NOT STARTED"
    And the state for "Before You submit - Check your answers" is displayed to be "CANNOT START YET"
    Examples:
      | task                                                                              |
      | "About the appeal - Review accuracy of the appellant's submission"                |
      | "About the appeal - Do you have any extra conditions?"                            |
      | "About the appeal - Tell us about any appeals in the immediate area"              |
      | "About the appeal site - Tell us about the appeal site"                           |
      | "Required documents - Upload the plans used to reach the decision"                |
      | "Required documents - Upload the Planning Officer's report"                       |
      | "Optional supporting documents - Telling interested parties about the application"|
      | "Optional supporting documents - Representations from interested parties"         |
      | "Optional supporting documents - Notifying interested parties of the appeal"      |
      | "Optional supporting documents - Site notices"                                    |
      | "Optional supporting documents - Planning history"                                |
      | "Optional supporting documents - Statutory development plan policy"               |
      | "Optional supporting documents - Other relevant policies"                         |
      | "Optional supporting documents - Supplementary planning document extracts"        |
      | "Optional supporting documents - Development Plan Document or Neighbourhood Plan" |


Scenario: LPA Questionnaire task list page is displayed with static text
    Given the Householder planning appeal questionnaire page is presented
    Then the "Use the links below to submit your information. You can complete the sections in any order." is displayed
