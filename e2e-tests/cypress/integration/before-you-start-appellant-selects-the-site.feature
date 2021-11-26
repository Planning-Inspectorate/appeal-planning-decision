Feature: Appellant selects the site
  As an Appellant
  I  want to select the valid site
  so that I can proceed with the appeal

Scenario: AC01 Appellant selects None of these from the list option
  Given an appellant is on the is your appeal about any of the following page
  When appellant selects 'None of these' from the list of options
  And appellant clicks the continue button
  Then appellant gets routed to the have you received an enforcement notice page

Scenario: AC02 An error message is displayed when no selection is made
    Given an appellant is on the is your appeal about any of the following page
    When  appellant clicks the continue button
    Then appellant sees an error message 'Select if your appeal is about any of the following'

  Scenario: AC03 Back Link
    Given an appellant is on the is your appeal about any of the following page
    And appellant selects 'None of these' from the list of options
    When an appellant selects the back button
    Then an appellant is taken back to the what type of planning application did you make page
    And any information they have inputted will not be saved

  Scenario Outline: AC04 - Unable to select None of these and other options
   Given an appellant is on the is your appeal about any of the following page
   When appellant selects '<Option1>' from the list of options
   And appellant selects '<option2>' from the list of options
   Then '<Option1>' gets deselected
    Examples:
    |Option1|Option2|
    |None of these|A listed building|
    |None of these|Major dwellings|
    |None of these|Major general industry, storage or warehousing|
    |None of these|Major retail and services|
    |None of these|Major travelling and caravan pitches|
    |A listed building| None of these                  |
    |Major dwellings|None of these                  |
    |Major general industry, storage or warehousing|None of these                  |
    |Major retail and services|None of these                  |
   |Major travelling and caravan pitches|None of these                  |

Scenario Outline:AC05 Other sites
    Given an appellant is on the is your appeal about any of the following page
    When appellant selects '<option>' from the list of options
    And appellant clicks the continue button
   Then an appellants gets routed to shutter page which notifies them to use a different service
  Examples:
  |option|
  |A listed building|
  |Major dwellings|
  |Major general industry, storage or warehousing|
  |Major retail and services|
  |Major travelling and caravan pitches|

