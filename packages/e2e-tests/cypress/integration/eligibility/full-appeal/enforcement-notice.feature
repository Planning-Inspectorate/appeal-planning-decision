Feature: Enforcement notice
  As an appellant
  I want to select whether or not I have received an enforcement notice
  So that I can make an appeal

  Scenario: AC01 Appellant has not received an enforcement notice
    Given appellant is on the enforcement notice page
    When appellant selects 'No' from the options
    And appellant clicks on the continue button
    Then appellant gets navigated to the was your planning application claiming costs page

  Scenario: AC02 Appellant has received an enforcement notice
    Given appellant is on the enforcement notice page
    When appellant selects 'Yes' from the options
    And appellant clicks on the continue button
    Then appellant is navigated to the shutter page

  Scenario: AC03 appellant has not made any selection and they get an error message
    Given appellant is on the enforcement notice page
    When  appellant clicks on the continue button
   Then appellant sees an error message 'Select yes if you have received an enforcement notice'

  Scenario Outline:AC04 Back Link
    Given appellant is on the enforcement notice page for '<application_type>'
    When appellant selects 'Yes' from the options
    And appellant selects the back button
    Then appellant is navigated to the date decision due page
    And information they have inputted will not be saved

    Examples:
      | application_type |
      | Full planning  |
      