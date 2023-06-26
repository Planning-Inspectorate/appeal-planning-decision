Feature: As an Appellant or or Agent
  I want to provide the necessary details needed for my Application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario Outline: 1 - Navigate from 'Do you know who owns the rest of the land involved in the Appeal?' to the '<nextPage>'
    Given an Appellant or Agent is on the 'Do you know who owns the rest of the land involved in the Appeal' page
    When the user selects '<knowTheOwners>' and clicks 'Continue'
    Then the '<nextPage>' page is displayed with guidance text
    When they click on the Back link
    Then they are on the 'Do you know who owns the rest of the land involved in the Appeal' page and the option '<knowTheOwners>' is selected
    Examples:
      | knowTheOwners                              | nextPage                         |
      | I know who owns some of the land           | Identifying the other landowners |
      | No, I do not know who owns any of the land | Identifying the other landowners |

  Scenario Outline: 2 - Confirmation box is selected on the question 'Confirm that you have attempted to identify the landowners'
    Given an Appellant or Agent is on the '<currentPage>' page for the question '<knowTheOwners>'
    When the user selects the confirmation box and clicks 'Continue'
    Then the user is taken to the '<nextPage>'
    When they click on the Back link
    Then they are presented with the '<currentPage>' page for the question '<knowTheOwners>'
    Examples:
      | knowTheOwners                              | currentPage                      | nextPage                |
      | I know who owns some of the land           | Identifying the other landowners | Advertising your Appeal |
      | No, I do not know who owns any of the land | Identifying the other landowners | Advertising your Appeal |

  Scenario: 3 - The confirmation box is not selected on 'Confirm that you have attempted to identify the landowners'
    Given an Appellant or Agent is on the 'Identifying the landowners' page
    When the user clicks 'Continue' without selecting the confirmation box
    Then they are presented with an error message "Confirm if you've attempted to identify the landowners"
