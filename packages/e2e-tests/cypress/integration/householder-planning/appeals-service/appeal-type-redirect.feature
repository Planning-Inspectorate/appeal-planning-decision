Feature: As an Appellant/Agent
  I want the application to redirect me back to the first question if the appeal type is not set
  So that I can be sure I'm providing the correct information for the Householder appeal type

  Scenario Outline: <Test> - The user has not started an appeal and manually goes to the <URL> page
    Given the user wants to start an appeal from a random page
    When they manually go to the '<URL>' page
    Then they are redirected back to the first question
    Examples:
      | Test | URL                                             |
      | 1    | before-you-start/listed-building-householder    |
      | 2    | before-you-start/granted-or-refused-householder |
      | 3    | before-you-start/decision-date-householder      |
      | 4    | before-you-start/enforcement-notice-householder |
      | 5    | before-you-start/claiming-costs-householder     |
      | 6    | before-you-start/prior-approval-existing-home   |
      | 7    | before-you-start/you-cannot-appeal              |
      | 8    | appellant-submission/task-list                  |
      | 9    | appellant-submission/who-are-you                |
      | 10   | appellant-submission/your-details               |
      | 11   | appellant-submission/applicant-name             |
      | 12   | appellant-submission/application-number         |
      | 13   | appellant-submission/upload-application         |
      | 14   | appellant-submission/upload-decision            |
      | 15   | appellant-submission/appeal-statement           |
      | 16   | appellant-submission/supporting-documents       |
      | 17   | appellant-submission/site-location              |
      | 18   | appellant-submission/site-ownership             |
      | 19   | appellant-submission/site-ownership-certb       |
      | 20   | appellant-submission/site-access                |
      | 21   | appellant-submission/site-access-safety         |
      | 22   | appellant-submission/check-answers              |
      | 23   | appellant-submission/submission?                |

  Scenario Outline: <Test> - The user has started an appeal and is taken to the <URL> page
    Given the user has started an appeal and not yet selected an appeal type
    When they are taken to the '<URL>' page
    Then they are not redirected back to the first question and remain on the '<URL>' page
    Examples:
      | Test | URL                                           |
      | 24   | before-you-start/local-planning-depart        |
      | 25   | before-you-start/type-of-planning-application |
      | 26   | before-you-start/use-a-different-service      |
      | 27   | appellant-submission/submission-information   |
