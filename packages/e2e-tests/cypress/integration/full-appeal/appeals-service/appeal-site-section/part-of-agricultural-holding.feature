Feature: As an appellant/agent
  I want to provide the details if the site is part of an agricultural holding for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'Do you own all of the land involved in the appeal?' to 'Is the appeal site part of an agricultural holding?'
    Given an appellant or agent is on the 'Do you own all of the land involved in the appeal' page
    When the user select 'Yes' and click 'Continue'
    Then 'Is the appeal site part of an agricultural holding' page is displayed with some guidance text

  Scenario: 2 - Yes option is selected on 'Is the appeal site part of an agricultural holding'
    Given an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page
    When the user select 'Yes' and click 'Continue'
    Then the user is taken to the next page 'Are you a tenant of the agricultural holding'
    When they click on the 'Back' link
    Then 'Is the appeal site part of an agricultural holding' page is displayed with some guidance text
    And the 'Yes' option is selected

  Scenario: 3 - No option is selected on 'Is the appeal site part of an agricultural holding'
    Given an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page
    When the user select 'No' and click 'Continue'
    Then are taken to the next page 'Is the site visible from a public road'
    When they click on the 'Back' link
    Then 'Is the appeal site part of an agricultural holding' page is displayed with some guidance text
    And the 'No' option is selected

  Scenario: 4 - None of the options is selected on 'Is the appeal site part of an agricultural holding'
    Given an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page
    When the user select 'None of the options' and click 'Continue'
    Then they are presented with an error message 'Select yes if the appeal site is part of an agricultural holding'

  Scenario: 5 - Navigate from 'Is the appeal site part of an agricultural holding' page back to 'Do you own all the land involved in the appeal' page
    Given an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page
    When they click on the 'Back' link
    Then they are presented with the 'Do you own all of the land involved in the appeal' page

  Scenario Outline: 05 - Navigate from '<CurrentPage>' page back to '<PreviousPage>' using the journey '<KnowTheOwners>' selecting option OwnAllLand as '<OwnAllLand>' and OwnSomeLand as '<OwnSomeOfLand>'
    Given an appellant or agent is on the '<CurrentPage>' page for the journey OwnSomeOfLand as 'Yes' and '<KnowTheOwners>'
    When they click on the 'Back' link
    Then they are presented with the '<PreviousPage>' page
    Examples:
      | OwnAllLand | OwnSomeOfLand | KnowTheOwners                              | PreviousPage                 | CurrentPage         |
      | No         | Yes           | Yes, I know who owns all the land          | Telling the other landowners | agriculturalHolding |
      | No         | Yes           | I know who owns some of the land           | Telling the other landowners | agriculturalHolding |
      | No         | Yes           | No, I do not know who owns any of the land | Advertising your appeal      | agriculturalHolding |

  Scenario Outline: 06 - Navigate from '<CurrentPage>' page back to '<PreviousPage>' using the journey '<KnowTheOwners>' selecting option OwnAllLand as '<OwnAllLand>' and OwnSomeLand as '<OwnSomeOfLand>'
    Given an appellant or agent is on the '<CurrentPage>' page for the journey OwnSomeOfLand as 'No' and '<KnowTheOwners>'
    When they click on the 'Back' link
    Then they are presented with the '<PreviousPage>' page
    Examples:
      | OwnAllLand | OwnSomeOfLand | KnowTheOwners                              | PreviousPage            | CurrentPage         |
      | No         | No            | Yes, I know who owns all the land          | Telling the landowners  | agriculturalHolding |
      | No         | No            | I know who owns some of the land           | Telling the landowners  | agriculturalHolding |
      | No         | No            | No, I do not know who owns any of the land | Advertising your appeal | agriculturalHolding |
