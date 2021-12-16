Feature: Appeal Full Planning Application Status Question
  As an appellant
  I want to select the planning application status type of planning Application I made
  So that I can proceed to raise an appeal

Scenario: AC01-1 Appellant selects Granted Planning Application Status and proceeds through to "Decision Date" page
  Given an appellant is on the "was your planning application granted or refused" page
  When the appellant selects the option as 'Granted'
  And the appellant clicks on the "continue" button
  Then the appellant gets navigated to the "What’s the decision date on the letter from the local planning department?"

Scenario: AC01-2 Appellant selects Refused Planning Application Status and proceeds through to "Decision Date" page
  Given an appellant is on the "was your planning application granted or refused" page
  When the appellant selects the option as 'Refused'
  And the appellant clicks on the "continue" button
  Then the appellant gets navigated to the "What’s the decision date on the letter from the local planning department?"

Scenario: AC02 Appellant selects 'I have not received a decision' sPlanning Application Status and proceeds through to "Decision Date Due" page
  Given an appellant is on the "was your planning application granted or refused" page
  When the appellant selects the option as 'I have Not Received a Decision'
  And the appellant clicks on the "continue" button
  Then the appellant gets navigated to the "What date was your decision due?”

Scenario: AC-03 Appellant does not select any Planning Application Status and is provided an error
  Given an appellant is on the "was your planning application granted or refused" page
  When the appellant clicks on the "continue" button
  Then the appellant sees an error message 'Select if your planning application was granted or refused, or if you have not received a decision'

Scenario: AC-04 Appellant clicks back link and proceeds through to "Any of Following" page
  Given an appellant is on the "was your planning application granted or refused" page
  When the appellant clicks the back button
  Then the appellant is taken back to “Was your planning application about any of the following?”
