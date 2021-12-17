Feature: Appeal Full Planning Application Status Question
  As an appellant
  I want to select the planning application status type of planning Application I made
  So that I can proceed to raise an appeal

Scenario Outline: AC01 Appellant selects Granted Planning Application Status and proceeds through to "Decision Date" page
  Given appellant is on the was your planning application granted or refused page
  When the appellant selects the option as '<application_status>'
  And appellant clicks on the continue button
  Then appellant gets navigated to the What’s the decision date on the letter from the local planning department?
  Examples:
  |application_status|
  |Granted           |
  |Refused           |


Scenario: AC02 Appellant selects 'I have not received a decision for Planning Application
  Given appellant is on the was your planning application granted or refused page
  When the appellant selects the option as 'I have Not Received a Decision'
  And appellant clicks on the continue button
  Then the appellant gets navigated to the decision due page

Scenario: AC03 Appellant does not select any Planning Application Status and is provided an error
  Given appellant is on the was your planning application granted or refused page
  When appellant clicks on the continue button
  Then the appellant sees an error message 'Select if your planning application was granted or refused, or if you have not received a decision'

Scenario: AC04 Appellant clicks back link and proceeds through to Any of Following page
  Given appellant is on the was your planning application granted or refused page
  When an appellant selects the back button
  Then the appellant is navigated to Was your planning application about any of the following?
