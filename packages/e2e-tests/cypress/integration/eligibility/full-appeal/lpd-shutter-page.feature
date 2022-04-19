Feature:Shutter page
  As an appellant
  I want to receive a notification when I select services that are not being provisioned

  Scenario: AC01 - Shutter page
    Given an appellant is on the local planning department shutter page
    Then appellant is displayed details for shutter page

 Scenario: AC02 - ACP Link
    Given an appellant is on the local planning department shutter page
    And an appellant is presented with a link to use an existing service
    When an appellant clicks on the continue to the appeals casework portal link
    Then an appellant is able to navigate to casework appeal portal
