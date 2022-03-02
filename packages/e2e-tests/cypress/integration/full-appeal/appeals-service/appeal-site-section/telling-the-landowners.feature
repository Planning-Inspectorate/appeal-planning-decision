Feature: As an appellant/agent
  I want to provide the necessary details needed for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario Outline: AC01 - Navigate from ‘Do you know who owns the land involved in the appeal?' to '<landowners>'
    Given  an appellant or agent is on the Do you know who owns the land involved in the appeal page for '<landowners>'
    When the appellant select '<knowTheOwners>' and click continue for '<landowners>'
    Then Telling the '<landowners>' page is displayed with guidance text
    Examples:
      | knowTheOwners                     | landowners                   |
      | Yes, I know who owns all the land | Telling the landowners       |
      | Yes, I know who owns all the land | Telling the other landowners |
      | I know who owns some of the land  | Telling the landowners       |
      | I know who owns some of the land  | Telling the other landowners |

  Scenario Outline: AC02 - All 3 confirmation boxes have been selected for '<ownSomeOfTheLand>' and '<knowTheOwners>'
    Given an appellant or agent is on the Telling the landowners page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user select the confirmation boxes for the "<options>" and click continue
    Then the user is navigated to Is the appeal site part of an agricultural holding page
    Examples:
      | knowTheOwners                     | ownSomeOfTheLand | options                                                                                                                            |
      | Yes, I know who owns all the land | No               | I've told all the landowners about my appeal, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |
      | Yes, I know who owns all the land | Yes              | I've told all the landowners about my appeal, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land  | Yes              | I've told all the landowners about my appeal, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land  | No               | I've told all the landowners about my appeal, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |

  Scenario Outline: AC03 - None of the confirmation boxed have been selected for '<ownSomeOfTheLand>' and '<knowTheOwners>'
    Given an appellant or agent is on the Telling the landowners page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user selects none of the options and clicks continue
    Then an error message "Confirm if you've told the landowners" is displayed
    Examples:
      | knowTheOwners                     | ownSomeOfTheLand |
      | Yes, I know who owns all the land | No               |
      | Yes, I know who owns all the land | Yes              |
      | I know who owns some of the land  | Yes              |
      | I know who owns some of the land  | No               |

  Scenario Outline: AC04 - Confirmation message '<options>' is selected
    Given an appellant or agent is on the Telling the landowners page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user select the confirmation boxes for the "<options>" and click continue
    Then an error message "Confirm if you've told the landowners" is displayed
    Examples:
      | knowTheOwners                     | ownSomeOfTheLand | options                                      |
      | Yes, I know who owns all the land | No               | I've told all the landowners about my appeal |
      | Yes, I know who owns all the land | Yes              | I've told all the landowners about my appeal |
      | I know who owns some of the land  | Yes              | I've told all the landowners about my appeal |
      | I know who owns some of the land  | No               | I've told all the landowners about my appeal |
      | Yes, I know who owns all the land | No               | I've done this within the last 21 days       |
      | Yes, I know who owns all the land | Yes              | I've done this within the last 21 days       |
      | I know who owns some of the land  | Yes              | I've done this within the last 21 days       |
      | I know who owns some of the land  | No               | I've done this within the last 21 days       |
      | Yes, I know who owns all the land | No               | I used a copy of the form in annexe 2A or 2B |
      | Yes, I know who owns all the land | Yes              | I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land  | Yes              | I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land  | No               | I used a copy of the form in annexe 2A or 2B |


  Scenario Outline: AC05 - Two Confirmation messages '<options>' are selected
    Given an appellant or agent is on the Telling the landowners page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user select the confirmation boxes for the "<options>" and click continue
    Then an error message "Confirm if you've told the landowners" is displayed

    Examples:
      | knowTheOwners                     | ownSomeOfTheLand | options                                                                                    |
      | Yes, I know who owns all the land | No               | I've told all the landowners about my appeal, I've done this within the last 21 days       |
      | Yes, I know who owns all the land | Yes              | out my appeal, I've done this within the last 21 days                                      |
      | I know who owns some of the land  | Yes              | I've told all the landowners about my appeal, I've done this within the last 21 days       |
      | I know who owns some of the land  | No               | I've told all the landowners about my appeal, I've done this within the last 21 days       |
      | Yes, I know who owns all the land | No               | I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B       |
      | Yes, I know who owns all the land | Yes              | I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B       |
      | I know who owns some of the land  | Yes              | I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B       |
      | I know who owns some of the land  | No               | I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B       |
      | Yes, I know who owns all the land | No               | I used a copy of the form in annexe 2A or 2B, I've told all the landowners about my appeal |
      | Yes, I know who owns all the land | Yes              | I used a copy of the form in annexe 2A or 2B, I've told all the landowners about my appeal |
      | I know who owns some of the land  | Yes              | I used a copy of the form in annexe 2A or 2B, I've told all the landowners about my appeal |
      | I know who owns some of the land  | No               | I used a copy of the form in annexe 2A or 2B, I've told all the landowners about my appeal |

  Scenario Outline: AC06 -  Navigate from ‘Telling the landowners' page back to ‘Do you know who owns the land involved in the appeal? page
    Given an appellant or agent is on the Telling the landowners page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When user clicks on the Back link
    Then they are presented with the Do you know who owns the land involved in the appeal page
    Examples:
      | knowTheOwners                     | ownSomeOfTheLand |
      | Yes, I know who owns all the land | No               |
      | Yes, I know who owns all the land | Yes              |
      | I know who owns some of the land  | Yes              |
      | I know who owns some of the land  | No               |

