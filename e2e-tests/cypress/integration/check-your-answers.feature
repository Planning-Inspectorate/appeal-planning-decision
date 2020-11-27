@wip
Feature: A prospective appellant confirms the information sent is accurate and the appeal can be fully considered

  Scenario Outline: Prospective appellant can review their data
    Given the user has provided your details <sample-data>
    When the user views the check your answers page
    Then they should see the provided data, and <your-details-status>
    And the user <can-proceed> proceed

    Examples:
      | sample-data           | your-details-status | can-proceed |
      | /about-you-valid.json | completed           | cannot      |

  Scenario Outline: Prospective appellant can modify previously submitted information of a draft appeal
    Given the user has submitted enough information to reach the Check Your Answers page
    When a user chooses to review <section>
    Then the user is presented with the current values and is able to modify them subject to validation rules

    Examples:
      | section    |
      | About You  |
