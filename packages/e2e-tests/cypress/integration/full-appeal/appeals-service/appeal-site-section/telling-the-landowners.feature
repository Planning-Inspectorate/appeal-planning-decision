Feature: As an appellant/agent
  I want to provide the necessary details needed for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario Outline: AC01 - Navigate from ‘Do you know who owns the land involved in the appeal?' to ‘Telling the landowners'
    Given  an appellant or agent is on the Do you know who owns the land involved in the appeal page
    When the appellant select '<knowTheOwners>' and click continue
    Then Telling the landowners page is displayed with guidance text
    Examples:
    |knowTheOwners|
    |Yes, I know who owns all the land|

#  Scenario: AC02 - Navigate from ‘Advertising your appeal’ /full-appeal/submit-appeal/advertising-your-appeal to ‘Telling the landowners'
#    Given an appellant or agent selected ‘I know who owns some of the land’ on the ‘Do you know who owns the land involved in the appeal’? page
#    And is taken to the next page ‘Identifying the landowners’ where they confirm they have attempted to identify the land owners and continue
#    And are then taken to the next page ‘Advertising your appeal’
#    When they select the select continue on the ‘Advertising your appeal page'
#    Then ‘Telling the landowners’ page is displayed.


  Scenario Outline: AC03 - All 3 confirmation boxes have been selected for '<ownSomeOfTheLand>' and '<knowTheOwners>'
    Given an appellant or agent is on the Telling the landowners page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user select the confirmation boxes for the "<options>" and click continue
    Then the user is navigated to Is the appeal site part of an agricultural holding page
    Examples:
    |knowTheOwners|ownSomeOfTheLand|options|
    |Yes, I know who owns all the land|No|I've told all the landowners about my appeal, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B|
    |Yes, I know who owns all the land|Yes|I've told all the landowners about my appeal, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B|
  #  |I know who owns some of the land|Yes|I've told all the landowners about my appeal, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |

  Scenario Outline: AC04 - None of the confirmation boxed have been selected for '<ownSomeOfTheLand>' and '<knowTheOwners>'
    Given an appellant or agent is on the Telling the landowners page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user selects none of the options and clicks continue
    Then an error message "Confirm if you've told the landowners" is displayed
    Examples:
      |knowTheOwners|ownSomeOfTheLand|
      |Yes, I know who owns all the land|No|
      |Yes, I know who owns all the land|Yes|
     # |I know who owns some of the land|Yes|

  Scenario Outline: AC05 - Confirmation message '<options>' is selected
    Given an appellant or agent is on the Telling the landowners page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user select the confirmation boxes for the "<options>" and click continue
    Then an error message "Confirm if you've told the landowners" is displayed
    Examples:
      |knowTheOwners|ownSomeOfTheLand|options|
      |Yes, I know who owns all the land|No|I've told all the landowners about my appeal|
      |Yes, I know who owns all the land|Yes|I've told all the landowners about my appeal|
   #   |I know who owns some of the land|Yes|I've told all the landowners about my appeal|
      |Yes, I know who owns all the land|No|I've done this within the last 21 days|
      |Yes, I know who owns all the land|Yes|I've done this within the last 21 days|
   #   |I know who owns some of the land|Yes|I've done this within the last 21 days|
      |Yes, I know who owns all the land|No|I used a copy of the form in annexe 2A or 2B|
      |Yes, I know who owns all the land|Yes|I used a copy of the form in annexe 2A or 2B|
    #  |I know who owns some of the land|Yes|I used a copy of the form in annexe 2A or 2B|


  Scenario Outline: AC06 - Two Confirmation messages '<options>' are selected
    Given an appellant or agent is on the Telling the landowners page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user select the confirmation boxes for the "<options>" and click continue
    Then an error message "Confirm if you've told the landowners" is displayed

    Examples:
      |knowTheOwners|ownSomeOfTheLand|options|
      |Yes, I know who owns all the land|No|I've told all the landowners about my appeal, I've done this within the last 21 days|
      |Yes, I know who owns all the land|Yes|I've told all the landowners about my appeal, I've done this within the last 21 days|
    #  |I know who owns some of the land|Yes|I've told all the landowners about my appeal, I've done this within the last 21 days|
      |Yes, I know who owns all the land|No|I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B|
      |Yes, I know who owns all the land|Yes|I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B|
   #   |I know who owns some of the land|Yes|I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B|
      |Yes, I know who owns all the land|No|I used a copy of the form in annexe 2A or 2B, I've told all the landowners about my appeal|
      |Yes, I know who owns all the land|Yes|I used a copy of the form in annexe 2A or 2B, I've told all the landowners about my appeal|
   #   |I know who owns some of the land|Yes|I used a copy of the form in annexe 2A or 2B, I've told all the landowners about my appeal|

  Scenario Outline: AC07 -  Navigate from ‘Telling the landowners' page back to ‘Do you know who owns the land involved in the appeal? page /full-appeal/submit-appeal/know-the-owners
    Given an appellant or agent is on the Telling the landowners page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When user clicks on the Back link
    Then they are presented with the Do you know who owns the land involved in the appeal page
    Examples:
      |knowTheOwners|ownSomeOfTheLand|
      |Yes, I know who owns all the land|No|
      |Yes, I know who owns all the land|Yes|
     # |I know who owns some of the land|Yes|
