Feature: Appeal Full Appeal Listed Building
  As an appellant
  I want to select No from the list of options
  So that I can get routed to the next set of questions

Scenario: AC01 Appeal against a non-listed Building
  Given an appellant is on the is your application about a Listed Building Page
  When an appellant selects  "No" from the options
  And appellant clicks on the "continue" button
  Then appellant is navigated to the have you received an enforcement notice page

Scenario: AC02 Appellant has not made any selection and they get an error message
  Given an appellant is on the is your application about a Listed Building Page
  When an appellant has not made any selection
  And an appellant clicks on the continue button
  Then an appellant gets an error message on the same page

Scenario: AC03 Back Link
  Given an appellant is on the is your application about a Listed Building Page
  When an appellant selects the back link
  Then an appellant is on the what type of planning application did you make page
  And any information they have inputted will not be saved

Scenario: AC04 Appeal against a listed building
Given an appellant is on the is your application about a Listed Building Page
When an appellant selects "Yes" from the options
Then an appellant is routed to the shutter page which advises to use a different service
