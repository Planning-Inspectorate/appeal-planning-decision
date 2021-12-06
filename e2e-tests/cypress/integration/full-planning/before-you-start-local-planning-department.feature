@fullPlanning
Feature: Local Planning Department
  As an Appellant
  I want to enter the local planning department where my planning application was submitted to
  So that I can make an appeal

  Scenario Outline: AC01 - Eligible LPA
    Given appellant is on the Local Planning Authority Page
    When  appellant selects the '<Local planning department>' where the application needs to be submitted
    And  appellant clicks the continue button
    Then appellant is navigated to the planning application decision type page
    Examples:
    |Local planning department|
    |System Test Borough Council|
    |Bradford                   |
    |Hillingdon                |
    |Harrogate                |

  Scenario: AC02 appellant has not provided the name of a LPA and displayed an error message
    Given appellant is on the Local Planning Authority Page
    When appellant clicks the continue button
    Then appellant sees an error message 'Enter the name of the local planning department'

  Scenario: AC03 Appellant selects ineligible LPA
    Given appellant is on the Local Planning Authority Page
    When an appellant selects an ineligible LPA
    And  appellant clicks the continue button
    Then an appellants gets routed to shutter page which notifies them to use a different service
