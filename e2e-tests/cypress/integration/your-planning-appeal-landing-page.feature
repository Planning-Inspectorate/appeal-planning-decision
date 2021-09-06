Feature: A user has submitted an appeal and at a later date views the appeal status

  @AS-1606 @as-2307
  Scenario: the appellant views the appeal
    Given an "appellant" has submitted an appeal
    When your planning appeal page is viewed with a valid appealId
    Then the user sees the appropriate general data for "appellant" along with data for step 1
    And the user sees the label for appellant name as "Your name"

  @AS-1606 @as-2307
  Scenario: the agent views the appeal
    Given an "agent" has submitted an appeal
    When your planning appeal page is viewed with a valid appealId
    Then the user sees the appropriate general data for "agent" along with data for step 1
    And the user sees the label for appellant name as "Appellant name"

  @AS-1606
  Scenario: the appellant or agent visits a url with an invalid appealId
    Given an agent or appellant has submitted an appeal
    When your planning appeal page is viewed with an incorrect appealId
    Then the user sees the 404 page
