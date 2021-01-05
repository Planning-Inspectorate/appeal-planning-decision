Feature: Confirmation page feature
  The confirmation page must display the feedback link

  Scenario: Required link is present
    Given an appeal exists
    When the appeal confirmation is presented
    Then the required link is displayed in the page body

