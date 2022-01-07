Feature:Shutter page
  As an appellant
  I want to receive a notification when I select services that are not being provisioned

  Scenario: AC01 - Shutter page
    Given an appellant is on the shutter page
    Then appellant is displayed details for shutter page

 Scenario: AC02 - ACP Link
    Given an appellant is on the shutter page
    And an appellant is presented with a link to use a different service
    When an appellant clicks on the you can appeal using our appeals casework portal link
    Then an appellant is able to navigate to casework appeal portal
