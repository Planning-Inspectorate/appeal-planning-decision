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
#     | "Eligibility - Start appeal"                                           |
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
#      | "Appellant submission - Your appeal - Supporting documents"            |
#      | "Appellant submission - Your appeal - Other appeals"                   |
      | "Appellant submission - Appeal site - Site location"                   |
      | "Appellant submission - Appeal site - Site ownership"                  |
      | "Appellant submission - Appeal site - Site access"                     |
      | "Appellant submission - Appeal site - Site safety"                     |
      | "Appellant submission - Appeal answers"                                |
      | "Appeal submission"                                                    |
