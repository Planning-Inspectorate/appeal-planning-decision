Feature: As an appellant/agent
  I want to provide the necessary details needed for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario Outline: AC01 - Navigate from ‘Are you a tenant of the agricultural holding'? to '<tenants>'
    Given  an appellant or agent is on the Are you a tenant of the agricultural holding page
    When the appellant select '<option>' and click continue
    Then Telling the '<tenants>' page is displayed with guidance text
    Examples:
      |option|tenants|
      |No|Telling the tenants|
      |Yes|Telling the other tenants|

  Scenario Outline: AC02 - All 3 confirmation boxes have been selected for '<tenants>'
    Given an appellant or agent is on the '<tenants>' page
    When the user select the confirmation boxes for the "<options>" and click continue
    Then the user is navigated to Is the site visible from a public road page
    Examples:
      |tenants|options|
      |Telling the tenants|I've told all the tenants about my appeal, I've done this within the last 21 days, I used a copy of the form in Annexe 2a|
      |Telling the other tenants|I've told all the other tenants about my appeal, I've done this within the last 21 days, I used a copy of the form in Annexe 2a|

  Scenario Outline: AC03 - None of the confirmation boxed have been selected for '<tenants>'
    Given an appellant or agent is on the '<tenants>' page
    When the user selects none of the options and clicks continue
    Then an error message "Confirm if you've told the tenants" is displayed
    Examples:
      |tenants|
      |Telling the tenants|
      |Telling the other tenants|

  Scenario Outline: AC04 - Single confirmation message '<options>' is selected for '<tenants>'
    Given an appellant or agent is on the '<tenants>' page
    When the user select the confirmation boxes for the "<options>" and click continue
    Then an error message "Confirm if you've told the tenants" is displayed
    Examples:
      |tenants|options|
      |Telling the tenants|I've told all the tenants about my appeal|
      |Telling the tenants|I've done this within the last 21 days|
      |Telling the tenants|I used a copy of the form in Annexe 2a|
      |Telling the other tenants|I've told all the other tenants about my appeal|
      |Telling the other tenants|I've done this within the last 21 days|
      |Telling the other tenants|I used a copy of the form in Annexe 2a|


  Scenario Outline: AC05 - Two Confirmation messages '<options>' are selected for '<tenants>'
    Given an appellant or agent is on the '<tenants>' page
    When the user select the confirmation boxes for the "<options>" and click continue
    Then an error message "Confirm if you've told the tenants" is displayed

    Examples:
      |tenants|options|
      |Telling the tenants|I've told all the tenants about my appeal, I've done this within the last 21 days|
      |Telling the tenants|I've done this within the last 21 days, I used a copy of the form in Annexe 2a|
      |Telling the tenants|I've told all the tenants about my appeal, I used a copy of the form in Annexe 2a|
      |Telling the other tenants|I've told all the other tenants about my appeal, I used a copy of the form in Annexe 2a|
      |Telling the other tenants|I've done this within the last 21 days, I used a copy of the form in Annexe 2a|
      |Telling the other tenants|I've told all the other tenants about my appeal, I used a copy of the form in Annexe 2a|

  Scenario Outline: AC06 - Back link on '<tenants>'
    Given an appellant or agent is on the '<tenants>' page
    When user clicks on the Back link
    Then they are presented with the '<page>' page for '<tenants>'
    Examples:
      |tenants|page|
    |Telling the tenants|Are you a tenant of the agricultural holding?|
    |Telling the other tenants|Are there any other tenants?           |

