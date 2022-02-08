Feature: Appellant selects the site
  As an Appellant
  I  want to select the valid site
  so that I can proceed with the appeal

  Scenario Outline: AC01 Appellant selects None of these from the list option
  Given an appellant is on the is your appeal about any of the following page for '<application_type>'
  When appellant selects 'None of these' from the list of options
  And appellant clicks the continue button
  Then appellant gets routed to the have you received an granted or refused page

  Examples:
    | application_type |
    | Full planning  |
    | Outline planning  |
    | Prior approval  |
    | Reserved matters  |
    | Removal or variation of conditions  |

  Scenario Outline: AC02 An error message is displayed when no selection is made
  Given an appellant is on the is your appeal about any of the following page for '<application_type>'
  When  appellant clicks the continue button
  Then appellant sees an error message 'Select if your appeal is about any of the following'

  Examples:
    | application_type |
    | Full planning  |
    | Outline planning  |
    | Prior approval  |
    | Reserved matters  |
    | Removal or variation of conditions  |

  Scenario Outline: AC03 Back Link
    Given an appellant is on the is your appeal about any of the following page for '<application_type>'
    And appellant selects 'None of these' from the list of options
    When an appellant selects the back button
    Then an appellant is taken back to the what type of planning application did you make page
    And any information they have inputted will not be saved

    Examples:
      | application_type |
      | Full planning  |
      | Outline planning  |
      | Prior approval  |
      | Reserved matters  |
      | Removal or variation of conditions  |

  Scenario Outline: AC04 - Unable to select None of these and other options
  Given an appellant is on the is your appeal about any of the following page for '<application_type>'
  When appellant selects '<Option1>' from the list of options
  And appellant selects '<option2>' from the list of options
  Then '<Option2>' gets deselected

  Examples:
    | application_type | Option1| Option2|
    | Full planning | None of these|A listed building|
    | Full planning |None of these|Major dwellings|
    | Full planning |None of these|Major general industry, storage or warehousing|
    | Full planning |None of these|Major retail and services|
    | Full planning |None of these|Major travelling and caravan pitches|
    | Full planning |A listed building| None of these                  |
    | Full planning |Major dwellings|None of these                  |
    | Full planning |Major general industry, storage or warehousing|None of these                  |
    | Full planning |Major retail and services|None of these                  |
    | Full planning |Major travelling and caravan pitches|None of these                  |

Scenario Outline:AC05 Other sites
  Given an appellant is on the is your appeal about any of the following page for '<application_type>'
  When appellant selects '<option>' from the list of options
  And appellant clicks the continue button
  Then an appellants gets routed to shutter page which notifies them to use a different service

  Examples:
    | application_type |option|
    | Full planning  |A listed building|
    | Full planning  |Major dwellings|
    | Full planning  |Major general industry, storage or warehousing|
    | Full planning  |Major retail and services|
    | Full planning  |Major travelling and caravan pitches|

