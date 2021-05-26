Feature: Cookie Consent - View Preferences without JavaScript enabled

  As a user of the LPA Questionnaire
  I need to be informed of cookies and the impact of javascript
  So that I can enable the cookies if I want to

  Scenario: Make the content of the Cookie preference page specific to the use of Javascript when the user has Javascript turned off
    Given a user has elected to manage their cookie preference without JavaScript enabled
    When the user views the Cookie Preferences service page
    Then the page content will mention about cookies requiring Javascript to be turned on
