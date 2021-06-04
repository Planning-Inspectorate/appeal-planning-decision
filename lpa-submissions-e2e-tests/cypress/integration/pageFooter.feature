As a LPA Planning officer
I want to access the Planning Inspectorates policies
So that I can see what they do with personal information when I’m using of the the Planning Inspectorate’s services

Scenario Outline: AC-01 LPA taken to correct page when accessed links in the footer
  Given LPA planning officer accesses the LPA Questionnaire
  When they click on the '<links>' in the footer
  Then the '<page>' correct page should be displayed
  And the page title should be '<title>'
  Examples:
  |links             |page                                                                    |title|
  |Privacy           |https://www.gov.uk/guidance/appeals-casework-portal-privacy-cookies     |Appeals casework portal-Cookies-GOV.UK|
  |Cookies           |https://www.gov.uk/guidance/appeals-casework-portal-privacy-cookies     |Appeals casework portal-Cookies-GOV.UK|
  |Accessibility     |https://www.gov.uk/guidance/appeals-casework-portal-accessibility       |Accessibility statement for the appeals casework portal-GOV.UK|
  |Terms and Conditions|https://www.gov.uk/guidance/appeals-casework-portal-terms-and-conditions|Appeals casework portal - Terms and Conditions- GOV.UK|

