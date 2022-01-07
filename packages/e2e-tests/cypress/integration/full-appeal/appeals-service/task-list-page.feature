Feature: As an Appellant
  I want, at a glance, to see what information I need to submit and once started to see my progress
  So that the Planning Inspectorate has what it needs to consider my appeal

  Scenario:  Appellant has been successful through the Eligibility and they are now able to continue to start their appeal
    Given Appellant has been successful on their eligibility
    When they are on the 'Appeal a Planning Decision' page
    Then they are presented with the list of tasks that they are required to complete in order to submit their appeal
    And when a section has been completed, they are able to see what has been complete
