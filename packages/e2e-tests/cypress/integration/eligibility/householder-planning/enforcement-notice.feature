@e2e
Feature: Enforcement notice
  As an appellant
  I want to select whether or not I have received an enforcement notice
  So that I can make an appeal

  Scenario: AC01 Appellant has not received an enforcement notice
    Given appellant is on the enforcement notice page for householder planning
    When appellant selects 'No' from the enforcement notice options
    And appellant clicks on the continue button on enforcement notice page
    Then appellant gets navigated to was your planning application claiming costs page

  Scenario: AC02 Appellant has received an enforcement notice
    Given appellant is on the enforcement notice page for householder planning
    When appellant selects 'Yes' from the enforcement notice options
    And appellant clicks on the continue button on enforcement notice page
    Then appellant is navigated to the householder enforcement notice shutter page

  Scenario: AC03 appellant has not made any selection and they get an error message
    Given appellant is on the enforcement notice page for householder planning
    When appellant clicks on the continue button on enforcement notice page
    Then appellant sees an error message 'Select yes if you have received an enforcement notice'

  Scenario Outline:AC04 Back Link
    Given appellant is on the enforcement notice page for '<application_type>'
    When appellant selects 'Yes' from the enforcement notice options
    And appellant clicks the back button
    Then appellant is navigated to the householder decision date page
    And information they have inputted will not be saved

    Examples:
      | application_type |
      | Householder  |
