Feature: As an Appellant/Agent
         I want to be able to submit my appeal
         So that the Planning Inspectorate can action my appeal

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Appellant navigate from 'Check your answers' URL to 'Declaration' URL
    Given an Appellant is on the 'Check your answers' page
    When they click on 'Continue' button
    Then they are taken to the 'Declaration' page with the Declaration text

  Scenario: 2 - Appellant selects 'Confirm and submit appeal'
    Given an Appellant is ready to submit their appeal
    When they click on 'Confirm and submit appeal'
    Then they are taken to the next page 'Appeal Submitted'

  Scenario: 3 - Agent navigate from 'Check your answers' URL to 'Declaration' URL
    Given an Agent is on the 'Check your answers' page
    When they click on 'Continue' button
    Then they are taken to the 'Declaration' page with the Declaration text

  Scenario: 4 - Agent selects 'Confirm and submit appeal'
    Given an Agent is ready to submit their appeal
    When they click on 'Confirm and submit appeal'
    Then they are taken to the next page 'Appeal Submitted'
