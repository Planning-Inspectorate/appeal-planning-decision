Feature: Appeals in immediate area
  As a beta LPA I want to inform the Planning Inspectorate of any appeals in the immediate area
  So that the Planning Inspectorate can consider the appeal in light of others nearby.

  Scenario: Verify The Tell us about any appeals in the immediate area page
    Given The Householder planning appeal questionnaire page is presented
    When the user selects the link Tell us about any appeals in the immediate area
    Then the user is presented with the page 'Tell us about any appeals in the immediate area'
    And the page title is 'Are there any other appeals adjacent or close to the site still being considered? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'

  Scenario: AC01 LPA user makes no selection and is provided an error
    Given the user is on the Tell us about any appeals in the immediate area page
    When the user selects Save and Continue
    Then the user is shown the error message "Select yes if there are other appeals still being considered"
    And the user remains on 'Tell us about any appeals in the immediate area' page

  Scenario: AC02 LPA user selects no and navigates to task list
    Given the user is on the Tell us about any appeals in the immediate area page
    When the user selects the option 'No'
    And the user selects Save and Continue
    Then the user navigates to the Task List
    And a Completed status is populated for the task

  Scenario: AC03 LPA user selects yes and is presented with free text field
    Given the user is on the Tell us about any appeals in the immediate area page
    When the user selects the option 'Yes'
    Then the user is provided with a free text field to input the appeal reference numbers

  Scenario Outline: AC04 LPA user provides further information in text field and navigates to task list
    Given the user is on the Tell us about any appeals in the immediate area page
    When the user selects the option 'Yes'
    And the user enters '<appeal_reference_numbers>'
    And the user selects Save and Continue
    Then the user navigates to the Task List
    And a Completed status is populated for the task
    Examples:
      | appeal_reference_numbers          |
      | 1234567890                        |
      | 1234567890,97345345334,34535535   |
      | Test1234                          |
      | 1234Test                          |
      | Test/3232                         |
      | 3232/Test/12                      |
      | 1234567890, 97345345334, 34535535 |

  Scenario: AC05 LPA user does not provides further information in text field and is provided an error
    Given the user is on the Tell us about any appeals in the immediate area page
    When the user selects the option 'Yes'
    And user does not provide appeal reference numbers
    And the user selects Save and Continue
    Then the user is shown the error message 'Enter appeal reference number(s)'
    And the user remains on 'Tell us about any appeals in the immediate area' page

  Scenario: AC06 User has completed the Tell us about any appeals in the immediate area page and returns to that page from the Task List
    Given a user has completed the information needed on the appeals in immediate area page
    When the user returns to the 'Tell us about any appeals in the immediate area' page from the Task List
    Then the information they previously entered is still populated

  Scenario: AC07 Back link
    Given the user is on the Tell us about any appeals in the immediate area page
    When the user selects the option 'No'
    And the user selects the back link
    Then the user navigates to the Task List
    And any information they have entered will not be saved
