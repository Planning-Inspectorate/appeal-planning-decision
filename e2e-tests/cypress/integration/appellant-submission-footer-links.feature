@wip
Feature: Common links in footer section
  Each of the Eligibility and Appellant Submission webpages must display links to the following:
  * Terms and conditions
  * Privacy

  Scenario Outline: Required links in footer are present
    Given an appeal is being made
    When the <page> page is presented
    Then the required links are displayed
    Examples:
      | page                                                                   |
      | "Eligibility - Start appeal                                            |
      | "Eligibility - Decision date                                           |
      | "Eligibility - Planning department                                     |
      | "Eligibility - Planning department out                                 |
      | "Eligibility - Listed building                                         |
      | "Eligibility - Listed building out                                     |
      | "Eligibility - Appeal statement info                                   |
      | "Appellant Submission - Appeal tasks"                                  |
      | "Appellant Submission - Your details - Who are you"                    |
      | "Appellant Submission - Your details - Your details"                   |
      | "Appellant Submission - Your details - Applicant name"                 |
      | "Appellant Submission - Planning Application - Application number"     |
      | "Appellant Submission - Planning Application - Upload application"     |
      | "Appellant Submission - Planning Application - Upload decision letter" |
      | "Appellant Submission - Your appeal - Appeal statement"                |
      | "Appellant Submission - Your appeal - Supporting documents"            |
      | "Appellant Submission - Your appeal - Other appeals"                   |
      | "Appellant Submission - Appeal site - Site location"                   |
      | "Appellant Submission - Appeal site - Site ownership"                  |
      | "Appellant Submission - Appeal site - Site access"                     |
      | "Appellant Submission - Appeal site - Site safety"                     |
      | "Appellant Submission - Appeal answers"                                |
      | "Appeal submission"                                                    |





