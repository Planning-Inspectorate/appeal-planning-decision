Feature: Common link in header section
  Each of the Eligibility and Appellant Submission webpages must display link to feedback page

  @as-2264
  Scenario Outline: Required link in header is present
    Given an appeal is being made
    When the <page> page is presented
    Then the required header link is displayed
    Examples:
      | page                                                                   |
      | "Start your appeal"                                                    |
      | "Eligibility - House holder planning permission"                       |
      | "Eligibility - Householder planning permission out"                    |
      | "Eligibility - Decision date"                                          |
      | "Eligibility - Decision date expired"                                  |
      | "Eligibility - No decision date"                                       |
      | "Eligibility - Planning department"                                    |
      | "Eligibility - Planning department out"                                |
      | "Enforcement - Notice"                                                 |
      | "Enforcement - Notice out"                                             |
      | "Eligibility - Listed building"                                        |
      | "Eligibility - Listed building out"                                    |
      | "Eligibility - Costs"                                                  |
      | "Eligibility - Costs out"                                              |
      | "Eligibility - Appeal statement info"                                  |
      | "Appellant submission - Appeal tasks"                                  |
      | "Appellant submission - Your details - Who are you"                    |
      | "Appellant submission - Your details - Your details"                   |
      | "Appellant submission - Your details - Applicant name"                 |
      | "Appellant submission - Planning application - Application number"     |
      | "Appellant submission - Planning application - Upload application"     |
      | "Appellant submission - Planning application - Upload decision letter" |
      | "Appellant submission - Your appeal - Appeal statement"                |
      | "Appellant submission - Your appeal - Supporting documents"            |
      | "Appellant submission - Appeal site - Site location"                   |
      | "Appellant submission - Appeal site - Site ownership"                  |
      | "Appellant submission - Appeal site - Site ownership certb"            |
      | "Appellant submission - Appeal site - Site access"                     |
      | "Appellant submission - Appeal site - Site safety"                     |
      | "Appellant submission - Check your answers"                            |
      | "Appeal submission - Declaration"                                      |
      | "Appeal submission - Confirmation"                                     |

  Scenario Outline: Required back button is present
    Given an appeal is being made
    When the <page> page is presented
    Then the back button is displayed
    Examples:
      | page                                                                   |
      | "Eligibility - House holder planning permission"                       |
      | "Eligibility - Householder planning permission out"                    |
      | "Eligibility - Decision date"                                          |
      | "Eligibility - No decision date"                                       |
      | "Eligibility - Planning department"                                    |
      | "Eligibility - Planning department out"                                |
      | "Enforcement - Notice"                                                 |
      | "Enforcement - Notice out"                                             |
      | "Eligibility - Listed building"                                        |
      | "Eligibility - Listed building out"                                    |
      | "Eligibility - Costs"                                                  |
      | "Eligibility - Costs out"                                              |
      | "Eligibility - Appeal statement info"                                  |
      | "Appellant submission - Your details - Who are you"                    |
      | "Appellant submission - Your details - Your details"                   |
      | "Appellant submission - Your details - Applicant name"                 |
      | "Appellant submission - Planning application - Application number"     |
      | "Appellant submission - Planning application - Upload application"     |
      | "Appellant submission - Planning application - Upload decision letter" |
      | "Appellant submission - Your appeal - Appeal statement"                |
      | "Appellant submission - Your appeal - Supporting documents"            |
      | "Appellant submission - Appeal site - Site location"                   |
      | "Appellant submission - Appeal site - Site ownership"                  |
      | "Appellant submission - Appeal site - Site ownership certb"            |
      | "Appellant submission - Appeal site - Site access"                     |
      | "Appellant submission - Appeal site - Site safety"                     |
      | "Appellant submission - Check your answers"                            |
      | "Appeal submission - Declaration"                                      |

