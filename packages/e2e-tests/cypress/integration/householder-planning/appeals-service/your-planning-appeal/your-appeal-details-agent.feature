@wip @has
Feature: Your Appeal Details
  As an agent
  I want to be able to view the information I submitted to the Planning Inspectorate
  So that I can review the information at anytime

  @as-1607 @as-1607-ac1 @as-1607-ac1-2
  Scenario: Add link to the ‘Your planning appeal’ page - agent
    Given an agent has submitted an appeal
    When the agent is on the ‘Your planning appeal’ page
    Then the page will contain a link to ‘View your appeal details’

  @as-1607 @as-1607-ac2 @as-1607-ac2-2 @as-2307
  Scenario: An agent views the appeal details
    Given an agent is on the 'Your planning appeal' page
    When the agent selects the 'View your appeal details' link
    Then the appeal details will be shown - agent, without files
    And the user sees the label for appellant name as "Appellant name"

  @as-1607 @as-1607-ac3 @as-1607-ac3-2
  Scenario: An agent decides to open all sections
    Given an agent is viewing a valid appeal with all sections closed
    When they select to open all sections
    Then all the sections are opened

  @as-1607 @as-1607-ac4 @as-1607-ac4-2
  Scenario: An agent decides to close all sections
    Given an agent is viewing a valid appeal with all sections open
    When they select to close all sections
    Then all the sections are closed

  @as-1607 @as-1607-ac5 @as-1607-ac5-1
  Scenario Outline: An agent decides to open a specific section
    Given an agent is viewing a valid appeal where at least one section is closed
    When they select to open the <section> section
    Then the <section> section details are displayed

    Examples:
      | section                                   |
      | "About the original planning application" |
      | "About your appeal"                       |
      | "Visiting the appeal site"                |

  @as-1607 @as-1607-ac6 @as-1607-ac6-2
  Scenario Outline: An agent decides to close a specific section
    Given an agent is viewing an appeal where at least one section is open
    When they select to close the <section> section
    Then the <section> section details are hidden

    Examples:
      | section                                   |
      | "About the original planning application" |
      | "About your appeal"                       |
      | "Visiting the appeal site"                |

  @as-1607 @as-1607-ac7 @as-1607-ac7-2
  Scenario: JS - all sections will be closed by default - agent
    Given an agent is viewing a valid appeal with JavaScript enabled
    Then all the sections on the page will be closed by default

  @as-1607 @as-1607-ac8 @as-1607-ac8-2
  Scenario: Non JS - all sections will be open by default - agent
    Given an agent is viewing the appeal details with Javascript disabled
    Then all the sections are opened

  @as-1607 @as-1607-ac9 @as-1607-ac2
  Scenario: File count for each document type - agent
    Given an agent has submitted an appeal that includes multiple documents
    Then a count for each document type will be displayed on the page - agent

  @as-1607 @as-1607-ac10 @as-1607-ac10-1
  Scenario: ‘Back' link goes back to the previous page￼- agent
    Given an agent is viewing a valid appeal
    When the agent selects the ‘Back’ link
    Then the "Your planning appeal" page will be displayed for the current appeal - agent
