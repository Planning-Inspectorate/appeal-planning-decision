@has
Feature: Common link in header section
  Each of the Eligibility and Appellant Submission webpages must display link to feedback page

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario Outline: Required link in header is present
    Given the <page> page is presented
    Then the required header link is displayed
    Examples:
      | page                                                                   |
      | "Eligibility - Planning department"                                    |
      | "Eligibility - Shutter page"                                           |
      | "Eligibility - Type of Planning Application"                           |
      | "Eligibility - Listed building"                                        |
      | "Eligibility - Granted Or Refused Permission"                          |
      | "Eligibility - Decision date"                                          |
      | "Eligibility - Decision date expired"                                  |
      | "Enforcement - Notice"                                                 |
      | "Eligibility - Costs"                                                  |
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
    Given the <page> page is presented
    Then the back button is displayed
    Examples:
      | page                                                                   |
      | "Eligibility - Type of Planning Application"                           |
      | "Eligibility - Listed building"                                        |
      | "Eligibility - Granted Or Refused Permission"                          |
      | "Eligibility - Decision date"                                          |
      | "Enforcement - Notice"                                                 |
      | "Eligibility - Costs"                                                  |
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
