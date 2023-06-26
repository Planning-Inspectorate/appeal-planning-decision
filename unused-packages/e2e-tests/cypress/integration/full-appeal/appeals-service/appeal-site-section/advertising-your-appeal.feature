Feature: As an appellant/agent
  I want to provide the necessary details needed for my application to be submitted
  So that I am sure that the information provided are accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario Outline: AC-01 Navigate from ‘Do you know who owns the land involved in the appeal?' to advertising your appeal for '<landowners>'
    Given  an appellant is on the Do you know who owns the land involved in the appeal page for '<landowners>'
    When the appellant select '<knowTheOwners>' and click continue
    And the appellant confirms that they have attempted to identify the other landowners
    Then advertising your appeal page is displayed with guidance text for '<landowners>' and '<knowTheOwners>'
    Examples:
      | knowTheOwners                              | landowners                   |
      | No, I do not know who owns any of the land | Telling the landowners       |
      | No, I do not know who owns any of the land | Telling the other landowners |
      | I know who owns some of the land           | Telling the landowners       |
      | I know who owns some of the land           | Telling the other landowners |


  Scenario Outline: AC02 - All 3 confirmation boxes have been selected for '<ownSomeOfTheLand>' and '<knowTheOwners>'
    Given an appellant or agent is on the Advertising your appeal page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user select the confirmation boxes for the "<options>" and click continue
    Then the user is navigated to '<page>' page
    Examples:
      | knowTheOwners                              | ownSomeOfTheLand | page                         | options                                                                                                                      |
      | No, I do not know who owns any of the land | No               | Agricultural holding         | I've advertised my appeal in the press, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |
      | No, I do not know who owns any of the land | Yes              | Agricultural holding         | I've advertised my appeal in the press, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land           | No               | Telling the landowners       | I've advertised my appeal in the press, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land           | Yes              | Telling the other landowners | I've advertised my appeal in the press, I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |


  Scenario Outline: AC03 - None of the confirmation boxed have been selected for '<ownSomeOfTheLand>' and '<knowTheOwners>'
    Given an appellant or agent is on the Advertising your appeal page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user selects none of the options and clicks continue
    Then an error message 'Confirm if you have advertised your appeal' is displayed
    Examples:
      | knowTheOwners                              | ownSomeOfTheLand |
      | No, I do not know who owns any of the land | No               |
      | No, I do not know who owns any of the land | Yes              |
      | I know who owns some of the land           | Yes              |
      | I know who owns some of the land           | No               |

  Scenario Outline: AC04 - Confirmation message '<options>' is selected
    Given an appellant or agent is on the Advertising your appeal page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user select the confirmation boxes for the "<options>" and click continue
    Then an error message 'Confirm if you have advertised your appeal' is displayed
    Examples:
      | knowTheOwners                              | ownSomeOfTheLand | options                                      |
      | No, I do not know who owns any of the land | No               | I've advertised my appeal in the press       |
      | No, I do not know who owns any of the land | Yes              | I've advertised my appeal in the press       |
      | I know who owns some of the land           | Yes              | I've advertised my appeal in the press       |
      | I know who owns some of the land           | No               | I've advertised my appeal in the press       |
      | No, I do not know who owns any of the land | No               | I've done this within the last 21 days       |
      | No, I do not know who owns any of the land | Yes              | I've done this within the last 21 days       |
      | I know who owns some of the land           | Yes              | I've done this within the last 21 days       |
      | I know who owns some of the land           | No               | I've done this within the last 21 days       |
      | No, I do not know who owns any of the land | No               | I used a copy of the form in annexe 2A or 2B |
      | No, I do not know who owns any of the land | Yes              | I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land           | Yes              | I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land           | No               | I used a copy of the form in annexe 2A or 2B |

  Scenario Outline: AC05 - Two Confirmation messages '<options>' are selected
    Given an appellant or agent is on the Advertising your appeal page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When the user select the confirmation boxes for the "<options>" and click continue
    Then an error message 'Confirm if you have advertised your appeal' is displayed

    Examples:
      | knowTheOwners                              | ownSomeOfTheLand | options                                                                              |
      | No, I do not know who owns any of the land | No               | I've advertised my appeal in the press, I've done this within the last 21 days       |
      | No, I do not know who owns any of the land | Yes              | I've advertised my appeal in the press, I've done this within the last 21 days       |
      | I know who owns some of the land           | Yes              | I've advertised my appeal in the press, I've done this within the last 21 days       |
      | I know who owns some of the land           | No               | I've advertised my appeal in the press, I've done this within the last 21 days       |
      | No, I do not know who owns any of the land | No               | I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |
      | No, I do not know who owns any of the land | Yes              | I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land           | Yes              | I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land           | No               | I've done this within the last 21 days, I used a copy of the form in annexe 2A or 2B |
      | No, I do not know who owns any of the land | No               | I've advertised my appeal in the press, I used a copy of the form in annexe 2A or 2B |
      | No, I do not know who owns any of the land | Yes              | I've advertised my appeal in the press, I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land           | Yes              | I've advertised my appeal in the press, I used a copy of the form in annexe 2A or 2B |
      | I know who owns some of the land           | No               | I've advertised my appeal in the press, I used a copy of the form in annexe 2A or 2B |

  Scenario Outline: AC06 -  Navigate from ‘Advertising your appeal' page back to ‘Identify the landowners' page
    Given an appellant or agent is on the Advertising your appeal page for the '<knowTheOwners>' and '<ownSomeOfTheLand>'
    When user clicks on the Back link
    Then they are presented with the Identify the landowners page
    Examples:
      | knowTheOwners                              | ownSomeOfTheLand |
      | No, I do not know who owns any of the land | No               |
      | No, I do not know who owns any of the land | Yes              |
      | I know who owns some of the land           | Yes              |
      | I know who owns some of the land           | No               |
