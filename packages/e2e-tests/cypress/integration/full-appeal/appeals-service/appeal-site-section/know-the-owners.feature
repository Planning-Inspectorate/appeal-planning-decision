@e2e
Feature: As an appellant/agent
  I want to provide the land details needed for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'Do you own some of the land involved in the appeal' to 'Do you know who owns the  the land involved in the appeal?
    Given an appellant or agent is on the 'Do you own some of the land involved in the appeal' page
    When the user select 'No' and click 'Continue'
    Then 'Do you know who owns the land involved in the appeal' page is displayed

  Scenario: 2 - Navigate from 'Do you own some of the land involved in the appeal' to 'Do you know who owns the rest of the land involved in the appeal?'
    Given an appellant or agent is on the 'Do you own some of the land involved in the appeal' page
    When the user select 'Yes' and click 'Continue'
    Then 'Do you know who owns the rest of the land involved in the appeal?' page is displayed

  Scenario Outline: 3 - None of the options is selected on 'Do you Own Some of the Land or Rest of the Land pages'
    Given an appellant or agent is on the current page '<current page>' page
    When the user select '<option>' and click 'Continue'
    Then they are presented with an error message '<error message>'
    Examples:
      | current page                                                      | option              | error message                                                           |
      | Do you know who owns the rest of the land involved in the appeal? | None of the options | Select if you know who owns the rest of the land involved in the appeal |
      | Do you know who owns the land involved in the appeal              | None of the options | Select if you know who owns the land involved in the appeal             |

  Scenario Outline: 4 - Navigate from 'Do you know some of the land involved in the appeal' to the relevant pages based on the selected options
    Given an appellant or agent is on the current page '<current page>' page
    When the user select '<option>' and click 'Continue'
    Then the user will be taken to the next page '<next page>'
    Examples:
      | current page                                                      | option                                     | next page                        |
      | Do you know who owns the rest of the land involved in the appeal? | Yes, I know who owns all the land          | Telling the other landowners     |
      | Do you know who owns the rest of the land involved in the appeal? | I know who owns some of the land           | Identifying the other landowners |
      | Do you know who owns the rest of the land involved in the appeal? | No, I do not know who owns any of the land | Identifying the other landowners |
      | Do you know who owns the land involved in the appeal              | Yes, I know who owns all the land          | Telling the other landowners     |
      | Do you know who owns the land involved in the appeal              | I know who owns some of the land           | Identifying the other landowners |
      | Do you know who owns the land involved in the appeal              | No, I do not know who owns any of the land | Identifying the other landowners |

  Scenario Outline: 5 - Navigate using back link
    Given an appellant or agent is on the current page '<current page>' page
    When they click on the 'Back' link
    Then the user will be taken to the next page '<next page>'
    Examples:
      | current page                                                      | next page                                          |
      | Do you know who owns the rest of the land involved in the appeal? | Do you own some of the land involved in the appeal |
      | Do you know who owns the land involved in the appeal              | Do you own some of the land involved in the appeal |



