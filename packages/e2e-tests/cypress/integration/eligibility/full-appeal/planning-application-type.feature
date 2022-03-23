@e2e
Feature: Planning Application Type
  As an appellant
  I want to select the type of planning Application I made
  So that I can raise appropriate appeal

  Scenario: AC01 Appellant selects Householder application type
    Given an appellant is on the select the type of planning application you made page
    When appellant selects 'Householder' planning application type
    And appellant clicks on the continue button
    Then appellant is navigated to the About A Listed Building Page

  Scenario Outline: AC02 Appellant selects <planning_application>
    Given an appellant is on the select the type of planning application you made page
    When appellant selects '<planning_application>' planning application type
    And appellant clicks on the continue button
    Then appellant is navigated to the is your planning application about any of the following page
  Examples:
    | planning_application |
    | Full planning        |
    | Outline planning     |
    | Reserved matters     |

  Scenario: AC03 Appellant selects Prior application
    Given an appellant is on the select the type of planning application you made page
    When appellant selects 'Prior approval' planning application type
    And appellant clicks on the continue button
    Then appellant is presented with the page Did you apply for prior approval to extend an existing home?

  Scenario: AC03 appellant has not selected any of planning application types
    Given an appellant is on the select the type of planning application you made page
    When appellant clicks on the continue button
    Then appellant sees an error message 'Select which type of planning application your appeal is about, or if you have not made a planning application'

  Scenario: AC04 - Back link
    Given an appellant is on the select the type of planning application you made page
    When appellant selects 'Householder' planning application type
    And an appellant selects the back button
    Then an appellant is navigated to the what local planning department did you submit your application to page
    And any information they have inputted for planning type will not be saved

  Scenario Outline:AC05 - Appellants selects Something else or I have Not Made An Appeal
    Given an appellant is on the select the type of planning application you made page
    When appellant selects '<invalid_planning_type>' planning application type
    And appellant clicks on the continue button
    Then an appellants gets routed to shutter page which notifies them to use a different service
    Examples:
    |invalid_planning_type|
    |Something else       |
    |I have not made a planning application|

