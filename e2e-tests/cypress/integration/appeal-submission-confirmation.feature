Feature: Confirmation page feature
  The confirmation page must display the feedback link and its header has no back buttons

  @as-2264
  Scenario: Required link is present
    Given an appeal exists
    When the appeal confirmation is presented
    Then the required link is displayed in the page body

  Scenario: The back button is not present
    Given an appeal exists
    When the appeal confirmation is presented
    Then the back button is not displayed
