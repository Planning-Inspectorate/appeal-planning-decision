Feature: Appeals Extra Conditions
  As a beta LPA I want to inform the Planning Inspectorate of any extra conditions I wish to be attached to the appeal decision (over and above the standard ones)
So that the Inspector can decide whether or not to attach them to their decision.

Scenario: AC01 - User navigates to 'Do you have extra conditions' page
  Given the householder planning appeal questionnaire task list is presented
  When the user selects the link 'Do you have any extra conditions?'
  Then the user is presented with the 'Do you have any extra conditions?' page
  And the Page title is 'Do you have any extra conditions? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'

Scenario: AC02 - User makes no selection and is provided an error
  Given user is in the extra conditions page
  When user does not select an option
  And user selects Save and Continue
  Then user is shown an error message "Select yes if you have extra conditions"
  And the user remains on extra conditions page

Scenario: AC03 - User selects no and proceeds to task list
  Given user is in the extra conditions page
  When user selects the option 'No'
  And user selects Save and Continue
  Then user navigates to the Task List
  And a Completed status is populated for the task

Scenario: AC04 - user selects yes and provides further information in text field and proceeds to task list
  Given user is in the extra conditions page
  And user selects the option 'Yes'
  And user enters '<extra_information>'
  When user selects Save and Continue
  Then user navigates to the Task List
  And a Completed status is populated for the task
  Examples:
      | extra_information           |
      | some extra information      |
      | some more extra information |
      |  some extra information with a space at the beginning |
      | extra information with special characters ,. !" }]* & -+%$£@! |
      | a very long piece of extra information a very long piece of extra information
        a very long piece of extra information a very long piece of extra information
        a very long piece of extra information a very long piece of extra information
        a very long piece of extra information |

Scenario: AC05 - user does not provides further information in text field and is provided an error
  Given user is in the extra conditions page
  And user selects the option 'Yes'
  And user does not provide extra information
  When user selects Save and Continue
  Then user is shown an error message "What are the extra conditions?"
  And the user remains on extra conditions page

Scenario: AC06 - user can see the Appeal details side panel
  Given user is in the extra conditions page
  Then the appeal details panel is displayed on the right hand side of the page
  And the user remains on extra conditions page

Scenario: AC07 - Back link
  Given user is in the extra conditions page
  When user selects the back link
  Then user navigates to the Task List
  And any information they have entered will not be saved

Scenario: User has completed the extra conditions page and returns to that page from the Task List
  Given a user has completed the information needed on the extra conditions page
  When the user returns to the extra conditions page from the Task List
  Then the information they previously entered is still populated
