@wip
Feature: Special route handling for ACP integration
  With ACP integration only the following internal routes should be accessible:
  * Eligibility - Decision date
  * Eligibility - Decision date expired
  * Eligibility - No decision date

  Scenario Outline: (1) Available routes
    Given an appeal is being made
    When an attempt is made to access <page>
    Then the <page> is accessed
    Examples:
      | page                                                                   |
      | "Eligibility - Decision date"                                          |
      | "Eligibility - Decision date expired"                                  |
      | "Eligibility - No decision date"                                       |

  Scenario Outline: (2) Unavailable routes
    Given an appeal is being made
    When an attempt is made to access <page>
    Then the page is not accessed because the page is not found
    Examples:
      | page                                                                   |
      | "Eligibility - Planning department"                                    |
      | "Eligibility - Planning department out"                                |
      | "Eligibility - Listed building"                                        |
      | "Eligibility - Listed building out"                                    |
      | "Eligibility - Appeal statement info"                                  |
      | "Appellant submission - Appeal tasks"                                  |
      | "Appellant submission - Your details - Who are you"                    |
      | "Appellant submission - Your details - Your details"                   |
      | "Appellant submission - Your details - Applicant name"                 |
      | "Appellant submission - Planning application - Application number"     |
      | "Appellant submission - Planning application - Upload application"     |
      | "Appellant submission - Planning application - Upload decision letter" |
      | "Appellant submission - Your appeal - Appeal statement"                |
      | "Appellant submission - Appeal site - Site location"                   |
      | "Appellant submission - Appeal site - Site ownership"                  |
      | "Appellant submission - Appeal site - Site access"                     |
      | "Appellant submission - Appeal site - Site safety"                     |
      | "Appellant submission - Appeal answers"                                |
      | "Appeal submission"                                                    |
