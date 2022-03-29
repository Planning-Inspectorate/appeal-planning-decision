@wip @has
Feature: Back link
  As an appellant creating an appeal
  I need to be able to navigate back to my previous page within the appeal service
  So that I can change or review my previous answer


  Scenario: Appellant or agent can navigate back to previous page when javascript is turned off - eligiblity
    Given an appellant or agent is checking their eligibility with JavaScript disabled
    When they navigate forwards within the eligibility steps
    Then they will be able to navigate back to the previous page within the eligibility steps


  Scenario: Appellant or agent can navigate back to previous page when javascript is turned off - appeal
    Given an appellant or agent is creating an appeal with JavaScript disabled
    When they navigate forwards within the appeal steps
    Then they will be able to navigate back to the previous page within the appeal steps


  Scenario: Appellant or agent can navigate back to previous page when javascript is turned off - appeal back to task list
    Given an appellant or agent is on the task list with JavaScript disabled
    When they provide details about the original planning application
    Then they will be able to navigate back from the original planning application steps to the task list

  Scenario: Appellant or agent can navigate back to previous page when javascript is turned off - check your answers
    Given an appellant or agent is on check your answers with JavaScript disabled
    When they alter details about visiting the appeal site
    Then they will be able to navigate back from the visiting the appeal site steps to check your answers

  @as-115 @as-115-1-5
  Scenario: Appellant or agent can navigate back to previous page when javascript is enabled - eligiblity
    Given an appellant or agent is checking their eligibility with JavaScript enabled
    When they navigate forwards within the eligibility steps
    Then they will be able to navigate back to the previous page within the eligibility steps

  @as-115 @as-115-1-6
  Scenario: Appellant or agent can navigate back to previous page when javascript is enabled - appeal
    Given an appellant or agent is creating an appeal with JavaScript enabled
    When they navigate forwards within the appeal steps
    Then they will be able to navigate back to the previous page within the appeal steps

  @as-115 @as-115-1-7 @as-115-5
  Scenario: Appellant or agent can navigate back to previous page when javascript is enabled - appeal back to task list
    Given an appellant or agent is on the task list with JavaScript enabled
    When they provide details about the original planning application
    Then they will be able to navigate back from the original planning application steps to the task list

  @as-115 @as-115-1-8 @as-115-6
  Scenario: Appellant or agent can navigate back to previous page when javascript is enabled - check your answers
    Given an appellant or agent is on check your answers with JavaScript enabled
    When they alter details about visiting the appeal site
    Then they will be able to navigate back from the visiting the appeal site steps to check your answers

  @as-115 @as-115-2
  Scenario: When an error occurred on the previous page using the ‘Back’ link will return to that page without an error being displayed
    Given an appellant or agent had an error on the previous page
    When the appellant or agent uses the back link
    Then the page will be displayed without the error

  @as-115 @as-115-3
  Scenario: When an error occurs on the current page using the 'Back' link will return to the previous page without refreshing the current page
    Given an appellant or agent has an error on the current page
    When the appellant or agent selects to go back
    Then the previous page will be displayed without the current page being refreshed

  @as-115 @as-115-4
  Scenario: When the previous page was not in the appeal service. It will go back to the service ‘Start' page￼
    Given an appellant or Agent didn’t come from a previous page in the service
    When the appellant or agent selects to go back
    Then they will be taken to the ‘Start’ page of the service

  @as-115
  Scenario: We do not display a back button on the service 'Start' page
    Given an appellant or Agent visits the ‘Start’ page of the service
    When the appellant or agent wishes to go back
    Then they must use breadcrumbs or browser back button
