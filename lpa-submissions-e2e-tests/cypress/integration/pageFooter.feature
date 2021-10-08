Feature: As a LPA Planning officer
  I want to access the Planning Inspectorates policies
  So that I can see what they do with personal information when I’m using of the the Planning Inspectorate’s services

  Background:
    Given an appeal has been created
    And a questionnaire has been created
    And the LPA Planning Officer is authenticated

  Scenario Outline: AC-01 LPA taken to correct page when accessed links in the footer
    Given LPA planning officer accesses the LPA Questionnaire
    When they click on the '<links>' in the footer
    Then the '<page>' correct page should be displayed
    And the page title should be '<title>'
    Examples:
      | links                | page                                         | title                                                            |
      | Privacy              | appeals-casework-portal-privacy-cookies      | Appeals casework portal - Cookies - GOV.UK                       |
      | Cookies              | appeals-casework-portal-privacy-cookies      | Appeals casework portal - Cookies - GOV.UK                       |
      | Accessibility        | appeals-casework-portal-accessibility        | Accessibility statement for the appeals casework portal - GOV.UK |
      | Terms and Conditions | appeals-casework-portal-terms-and-conditions | Appeals casework portal - Terms and Conditions - GOV.UK          |

