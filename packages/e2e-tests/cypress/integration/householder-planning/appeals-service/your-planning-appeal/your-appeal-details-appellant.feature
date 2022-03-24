@wip @has
Feature: Your Appeal Details

  As an appellant
  I want to be able to view the information I submitted to the Planning Inspectorate
  So that I can review the information at anytime

  Scenario: Add link to the ‘Your planning appeal’ page - appellant
    Given an appellant has submitted an appeal
    When the appellant is on the ‘Your planning appeal’ page
    Then the page will contain a link to ‘View your appeal details’

  Scenario: An appellant views the appeal details
    Given an appellant is on the 'Your planning appeal' page
    When the appellant selects the 'View your appeal details' link
    Then the appeal details will be shown - appellant, without files
    And the user sees the label for appellant name as "Your name"

  Scenario: An appellant decides to open all sections
    Given an appellant is viewing a valid appeal with all sections closed
    When they select to open all sections
    Then all the sections are opened

  Scenario: An appellant decides to close all sections
    Given an appellant is viewing a valid appeal with all sections open
    When they select to close all sections
    Then all the sections are closed

  Scenario Outline: An appellant decides to open a specific section
    Given an appellant is viewing a valid appeal where at least one section is closed
    When they select to open the <section> section
    Then the <section> section details are displayed

    Examples:
      | section                                   |
      | "About the original planning application" |
      | "About your appeal"                       |
      | "Visiting the appeal site"                |

  Scenario Outline: An appellant decides to close a specific section
    Given an appellant is viewing an appeal where at least one section is open
    When they select to close the <section> section
    Then the <section> section details are hidden

    Examples:
      | section                                   |
      | "About the original planning application" |
      | "About your appeal"                       |
      | "Visiting the appeal site"                |

  Scenario: JS - all sections will be closed by default - appellant
    Given an appellant is viewing a valid appeal with JavaScript enabled
    Then all the sections on the page will be closed by default

  Scenario: Non JS - all sections will be open by default - appellant
    Given an appellant is viewing the appeal details with Javascript disabled
    Then all the sections are opened

  Scenario: File count for each document type - appellant
    Given an appellant has submitted an appeal that includes multiple documents
    Then a count for each document type will be displayed on the page - appellant

  Scenario: ‘Back' link goes back to the previous page￼- appellant
    Given an appellant is viewing a valid appeal
    When the appellant selects the ‘Back’ link
    Then the "Your planning appeal" page will be displayed for the current appeal - appellant

  Scenario: Display 400 error page when user session is not set therefore we don’t have the appeal ID
    Given an appellant or agent is viewing the appeal details for an invalid appeal ID
    Then the 400 error page will be displayed
