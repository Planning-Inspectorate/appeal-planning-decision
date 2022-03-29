@wip @has
Feature: Google Analytics
  Each of the Eligibility and Appellant Submission webpages needs to send data to Google Analytics platform

  Scenario Outline: Required GA script is present
    Given the <page> page is presented
    Then the required GA script is present
    Examples:
      | page                                                                   |
      | "Eligibility - Decision date"                                          |
      | "Eligibility - Decision date expired"                                  |
      | "Eligibility - No decision date"                                       |
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
