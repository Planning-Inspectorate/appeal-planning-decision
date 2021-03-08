Feature: Guidance Page - When you can appeal
  As a PO on the appeal service
  I want prospective appellants to be aware of who the service is for
  So that only those who need to appeal through the new appeal service do so

  Scenario Outline: AC1: Appellant selects <page> page from the Content list
    Given the appellant is on the when you can appeal page
    When the appellant select a link from the content list: <page>
    Then the appellant is navigated to that page: <url>

    Examples:
      | page | url |
      | "Before you appeal" | "/before-you-appeal" |
      | "The stages of an appeal" | "/stages-of-an-appeal" |
      | "After you appeal" | "/after-you-appeal" |
      | "Start your appeal" | "/start-your-appeal" |

  Scenario: AC2: Appellant navigates to next page
    Given the appellant is on the when you can appeal page
    When the appellant navigates to the next page
    Then information about the stages of an appeal is provided

  Scenario: AC3: Appellant navigates to previous page
    Given the appellant is on the when you can appeal page
    When the appellant navigates to the previous page
    Then information about before you appeal is provided
