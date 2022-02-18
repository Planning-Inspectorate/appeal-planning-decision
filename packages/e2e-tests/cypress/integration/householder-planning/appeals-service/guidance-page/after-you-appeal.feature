@wip @has
Feature: Guidance Page - After you appeal
  As a PO on the appeal service
  I want prospective appellants to be aware of what happens after they’ve appealed
  So that they are aware of what will happen

  Scenario Outline: AC1: Appellant selects <page> page from the Content list
    Given the appellant is on after you appeal page
    When the appellant select a link from the content list: <page>
    Then the appellant is navigated to that page: <url>

    Examples:
      | page | url |
      | "Before you appeal" | "/before-you-appeal" |
      | "When you can appeal" | "/when-you-can-appeal" |
      | "The stages of an appeal" | "/stages-of-an-appeal" |
      | "Start your appeal" | "/start-your-appeal" |

  Scenario: AC2: Appellant navigates to next page
    Given the appellant is on after you appeal page
    When the appellant navigates to the next page
    Then information about start your appeal is provided

  Scenario: AC3: Appellant navigates to previous page
    Given the appellant is on after you appeal page
    When the appellant navigates to the previous page
    Then information about the stages of an appeal is provided
