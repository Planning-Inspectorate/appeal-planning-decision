@e2e
Feature: Claiming Cost
  As an appellant
  I want to claim the costs incurred for the appeal

  Scenario: AC01 - Appellant doesn't want to claim costs
    Given appellant is on the claiming cost page
    When appellant selects 'No' from the options
    And appellant clicks on the continue button
    Then appellant gets navigated to HAS task list

  Scenario: AC02 - Appellant claims cost
    Given appellant is on the claiming cost page
    When appellant selects 'Yes' from the options
    And appellant clicks on the continue button
    Then appellants gets routed to shutter page which notifies them to use a different service

  Scenario: AC03 - Appellant makes no selection and is provided an error
    Given appellant is on the claiming cost page
    And appellant clicks on the continue button
    Then appellant sees an error message 'Select yes if you are claiming costs as part of your appeal'

  Scenario: AC-04 - Back Link
    Given appellant is on the claiming cost page
    When appellant selects 'Yes' from the options
    And appellant clicks the back button
    Then appellant is navigated to the enforcement notice page
    And information they have inputted will not be saved
