Feature: appealDetailsSidebar:
  As an LPA user I want to know which planning application I am responding on
  so that I provide the correct information to the Planning Inspectorate.

  The user should be able to see the following data relating to the appeal:

  Planning application number
  Site address
  Apellant Name

  Background:
    Given an appeal has been created
    And a questionnaire has been created

  Scenario: AC1-Appeal details sidebar is displayed with the correct information
    Given A subsection page is presented
    Then The appeal details sidebar is displayed with the correct information
