Feature: As an Appellant I want, at a glance, to see what information
         I need to submit and once started to see my progress
         So that the Planning Inspectorate has what it needs to consider my appeal

  Background:
    Given appellant has completed full appeal eligibility journey

  @smoke
  Scenario: 1 - Appellant has been successful through the Eligibility and they are now able to continue to start their appeal
    Given Appellant has been successful on their eligibility
    When they are on the 'Appeal a Planning Decision' page
    Then they are presented with the list of tasks that they are required to complete in order to submit their appeal
   # And when a section has been completed they are able to see what has been completed or incompleted

  Scenario: 2 - Appellant or Agent is on the Appeal a Planning Decision Task List
    Given that user is on the Appeal a Planning Decision task list
    When the user click on 'Tell us how you would prefer us to decide your appeal'
    Then the user is taken to the 'How would you prefer us to decide your appeal? page
