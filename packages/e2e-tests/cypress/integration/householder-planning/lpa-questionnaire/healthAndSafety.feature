@wip
Feature: Appeals Extra Conditions
  As a beta LPA I want to know if there are any health and safety issues at the appeal site
  So that I take the appropriate precautions

  Background:
    Given an appeal has been created
    And a questionnaire has been created

  Scenario: AC01 - User navigates to 'Are there any health and safety issues on the appeal site?' page
    Given a LPA Planning Officer is reviewing their LPA Questionnaire task list
    When the user selects the link 'Are there any health and safety issues on the appeal site?'
    Then the user is presented with the 'Are there any health and safety issues on the appeal site?' page
    And the Page title is 'Are there any health and safety issues on the appeal site? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'

  Scenario: AC02 - User makes no selection and is provided an error
    Given user is in the health and safety page
    When user does not select an option
    And user selects Save and Continue
    Then user is shown an error message "Select yes if there are health and safety issues"

  Scenario: AC03 - User selects no and proceeds to task list
    Given user is in the health and safety page
    When user selects the option 'No'
    And user selects Save and Continue
    Then progress is made to the task list
    And a Completed status is populated for the task

  Scenario Outline: AC04 - user selects yes and provides further information in text field and proceeds to task list
    Given user is in the health and safety page
    And user selects the option 'Yes'
    And user enters '<health and safety issues>'
    When user selects Save and Continue
    Then progress is made to the task list
    And a Completed status is populated for the task
    Examples:
      | health and safety issues |
      | some health and safety issues |
      | some more health and safety issues |
      |  some health and safety issues with a space at the beginning |
      | health and safety issues with special characters ,. !" }]* & -+%$£@! |
      | a very long piece of health and safety issues a very long piece of health and safety issues\na very long piece of health and safety issues a very long piece of health and safety issues\na very long piece of health and safety issues a very long piece of health and safety issues\na very long piece of health and safety issues |

  Scenario: AC05 - user does not provide further information in text field and is provided an error
    Given user is in the health and safety page
    And user selects the option 'Yes'
    And user does not provide health and safety issues
    When user selects Save and Continue
    Then user is shown an error message "Enter the health and safety issues"

  Scenario: AC06 - user can see the Appeal details side panel
    Given user is in the health and safety page
    Then the appeal details sidebar is displayed with the correct information

  Scenario: AC07 - Back link
    Given user is in the health and safety page
    When user selects the back link
    Then progress is made to the task list
    And any information they have entered will not be saved

  Scenario: AC08 - User has completed the health and safety page and returns to that page from the Task List
    Given a user has completed the information needed on the health and safety page
    When the user returns to the health and safety page from the Task List
    Then the information they previously entered is still populated

  Scenario: AC09 - Change answers
    Given a change to answer 'Health and Safety' is requested from Change your answers page
    When an answer is saved
    Then progress is made to the Check Your Answers page
    And the updated answer is displayed

  # Scenario: AC10 - PDF
  #   Given the questionnaire has been completed
  #   When the LPA Questionnaire is submitted
  #   Then the Health and Safety report is displayed on the PDF
  #   And the Health and Safety report is present in Horizon
