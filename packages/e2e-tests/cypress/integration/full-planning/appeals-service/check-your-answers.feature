Feature: As an Appellant/Agent
  I want to be able to review and change my answers
  So that my appeal is accurate

  #This scenario will be updated when the forms work with real data
  Scenario:  Appellant has provided their appeal details and is ready to check their answers before they submit their appeal
    Given the appellant is on the 'Appeal a planning decision' page
    When they click on 'Check your answers and submit your appeal' link
    Then the information they have inputted will be displayed

  Scenario: Agent has provided their appeal details and is ready to check their answers before they submit their appeal
    Given the agent is on the 'Appeal a planning decision' page
    When they click on 'Check your answers and submit your appeal' link
    Then the information they have inputted will be displayed

  Scenario Outline: Agent or Appellant select the back link
    Given the '<user>' is on the 'Check your answers' page
    When they select the 'Back' link
    Then the '<user>' is on the 'Appeal a planning decision' page

    Examples:
      | user      |
      | agent     |
      | appellant |
