Feature: Appeal Full Appeal Listed Building
  As an appellant
  I want to select No from the list of options
  So that I can get routed to the next set of questions

Scenario: AC01 Appeal against a non-listed Building
  Given appellant is on the is your application about a Listed Building Page
  When appellant selects the option as "No"
  And appellant clicks on the continue button
  Then appellant is navigated to granted or refused householder page

Scenario: AC02 Appellant has not made any selection and they get an error message
  Given appellant is on the is your application about a Listed Building Page
  When appellant has not made any selection
  And appellant clicks on the continue button
  Then appellant gets an error message on the same page

Scenario: AC03 Back Link
  Given appellant is on the is your application about a Listed Building Page
  When appellant selects the back link
  Then appellant is navigated to the what type of planning application did you make page
  And any information they have inputted will not be saved

Scenario: AC04 Appeal against a listed building
  Given appellant is on the is your application about a Listed Building Page
  When appellant selects the option as "Yes"
  And appellant clicks on the continue button
  Then appellant is navigated to the use an existing service for listed buildings page
