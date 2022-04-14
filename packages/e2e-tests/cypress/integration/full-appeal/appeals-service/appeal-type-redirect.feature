@smoketest @e2e
Feature: As an Appellant/Agent
  I want the application to redirect me back to the first question if the appeal type is not set
  So that I can be sure I'm providing the correct information for the Full Appeal appeal type

  Scenario Outline: <Test> - The user has not started an appeal and manually goes to the <URL> page
    Given the user wants to start an appeal from a random page
    When they manually go to the '<URL>' page
    Then they are redirected back to the first question
    Examples:
      | Test | URL                                                         |
      | 1    | before-you-start/any-of-following                           |
      | 2    | before-you-start/granted-or-refused                         |
      | 3    | before-you-start/decision-date                              |
      | 4    | before-you-start/date-decision-due                          |
      | 5    | before-you-start/enforcement-notice                         |
      | 6    | before-you-start/prior-approval-existing-home               |
      | 7    | before-you-start/you-cannot-appeal                          |
      | 8    | full-appeal/submit-appeal/task-list                         |
      | 9    | full-appeal/submit-appeal/original-applicant                |
      | 10   | full-appeal/submit-appeal/contact-details                   |
      | 11   | full-appeal/submit-appeal/applicant-name                    |
      | 12   | full-appeal/submit-appeal/appeal-site-address               |
      | 13   | full-appeal/submit-appeal/own-all-the-land                  |
      | 14   | full-appeal/submit-appeal/own-some-of-the-land              |
      | 15   | full-appeal/submit-appeal/know-the-owners                   |
      | 16   | full-appeal/submit-appeal/telling-the-landowners            |
      | 17   | full-appeal/submit-appeal/identifying-the-owners            |
      | 18   | full-appeal/submit-appeal/advertising-your-appeal           |
      | 19   | full-appeal/submit-appeal/agricultural-holding              |
      | 20   | full-appeal/submit-appeal/are-you-a-tenant                  |
      | 21   | full-appeal/submit-appeal/other-tenants                     |
      | 22   | full-appeal/submit-appeal/telling-the-tenants               |
      | 23   | full-appeal/submit-appeal/visible-from-road                 |
      | 24   | full-appeal/submit-appeal/health-safety-issues              |
      | 25   | full-appeal/submit-appeal/how-decide-appeal                 |
      | 26   | full-appeal/submit-appeal/why-hearing                       |
      | 27   | full-appeal/submit-appeal/draft-statement-common-ground     |
      | 28   | full-appeal/submit-appeal/why-inquiry                       |
      | 29   | full-appeal/submit-appeal/expect-inquiry-last               |
      | 30   | full-appeal/submit-appeal/application-form                  |
      | 31   | full-appeal/submit-appeal/application-number                |
      | 32   | full-appeal/submit-appeal/plans-drawings-documents          |
      | 33   | full-appeal/submit-appeal/design-access-statement-submitted |
      | 34   | full-appeal/submit-appeal/design-access-statement           |
      | 35   | full-appeal/submit-appeal/decision-letter                   |
      | 36   | full-appeal/submit-appeal/appeal-statement                  |
      | 37   | full-appeal/submit-appeal/plans-drawings                    |
      | 38   | full-appeal/submit-appeal/new-plans-drawings                |
      | 39   | full-appeal/submit-appeal/supporting-documents              |
      | 40   | full-appeal/submit-appeal/new-supporting-documents          |
      | 41   | full-appeal/submit-appeal/check-your-answers                |
      | 42   | full-appeal/submit-appeal/declaration                       |
      | 43   | full-appeal/submit-appeal/appeal-submitted                  |

  Scenario Outline: <Test> - The user has started an appeal and is taken to the <URL> page
    Given the user has started an appeal and not yet selected an appeal type
    When they are taken to the '<URL>' page
    Then they are not redirected back to the first question and remain on the '<URL>' page
    Examples:
      | Test | URL                                               |
      | 44   | before-you-start/local-planning-depart            |
      | 45   | before-you-start/type-of-planning-application     |
      | 46   | before-you-start/use-a-different-service          |
      | 47   | full-appeal/submit-appeal/declaration-information |
