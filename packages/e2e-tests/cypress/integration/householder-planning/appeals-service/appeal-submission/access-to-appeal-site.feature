@has
Feature: Access to the Appeal Site
  I want to notify the Planning Inspectorate if access to the appeal site is restricted so they are aware to contact me for access.

  Background:
    Given appellant has completed householder appeal eligibility journey

  Scenario: Prospective appellant provide access to the appeal site
    Given the user is prompted to provide access to the inspector visiting the appeal site
    When the user selects "Yes" to provide access
    Then the user can see the selected option "Yes is" submitted
    And Access to the appeal site section is "COMPLETED"

  Scenario: Prospective appellant does not provide additional information and access to the appeal site
    Given the user is prompted to provide access to the inspector visiting the appeal site
    When the user selects "No" to provide access
    And the user "does not" provide additional information
    Then the user is informed that "further information is required to gain access to the restricted site"
    And the user can see that there is no option submitted
    And Access to the appeal site section is "NOT STARTED"

  Scenario: Prospective appellant provide additional information on restricted access to the appeal site
    Given the user is prompted to provide access to the inspector visiting the appeal site
    When the user selects "No" to provide access
    And the user "does" provide additional information
    Then the user can see the selected option "No is" submitted
    And Access to the appeal site section is "COMPLETED"

  Scenario: Prospective appellant provide additional information which exceeds the character limit
    Given the user is prompted to provide access to the inspector visiting the appeal site
    When the user selects "No" to provide access
    And the user does provide additional information with character length exceeding the limit
    Then the user is told "How access is restricted must be 255 characters or less"
    And the user can see that there is no option submitted
    And Access to the appeal site section is "NOT STARTED"

  Scenario: Prospective appellant does not select any option to provide access to the appeal site
    Given the user is prompted to provide access to the inspector visiting the appeal site
    When the user does not select any option
    Then the user is told "Select Yes if the appeal site can be seen from a public road"
    And the user can see that there is no option submitted
    And Access to the appeal site section is "NOT STARTED"













