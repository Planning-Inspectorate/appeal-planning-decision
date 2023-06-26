@wip @has
Feature: Flash Messages

  As a PO for the appeals service
  I want the show users a one time message that can survive a page redirect
  So that helpful messages are displayed on successful action outcomes

  @as-1350
  Scenario: Flash message is displayed
    Given a user is managing their cookie preference
    When the user disables a not necessary cookie
    Then the user sees a one time message to denote action success
