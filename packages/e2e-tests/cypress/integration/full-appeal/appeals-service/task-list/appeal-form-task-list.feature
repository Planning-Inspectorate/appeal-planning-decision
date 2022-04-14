@smoketest @e2e
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
    And the status of the sections should be 'NOT STARTED'
    And the status of 'Check your answers and submit your appeal' should be 'CANNOT START YET'

  Scenario: 2 - Verify the Task list status is 'In Progress' if any of the sections is not completed
    Given Appellant has been successful on their eligibility
    When they are on the 'Appeal a Planning Decision' page
    Then they are presented with the list of tasks that they are required to complete in order to submit their appeal
    And the status of the sections should be 'NOT STARTED'
    And the status of 'Check your answers and submit your appeal' should be 'CANNOT START YET'
    When they click on 'Provide your contact details' section and are on 'Original Applicant' page
    And they select 'Yes, the planning application was made in my name' and click Continue button
    And they use 'Back' link to navigate back to the Task list page from 'Contact Details'
    Then status of the 'Provide your contact details' section should be 'IN PROGRESS'
    And the status of 'Check your answers and submit your appeal' should be 'CANNOT START YET'
    When they click on 'Tell us about the appeal site' section and are on the 'Site Address' page
    And they enter Site address and click Continue button
    And they use 'Back' link to navigate back to the Task list page from 'Own all the land' page
    Then status of the 'Tell us about the appeal site' section should be 'IN PROGRESS'
    And the status of 'Check your answers and submit your appeal' should be 'CANNOT START YET'
    When they click on 'Tell us how you would prefer us to decide your appeal' section and are on the 'Decide your appeal' page
    And they select 'Hearing' and click Continue button
    And they use 'Back' link to navigate back to the Task list page from 'Prefer a hearing' page
    Then status of the 'Tell us how you would prefer us to decide your appeal' section should be 'IN PROGRESS'
    And the status of 'Check your answers and submit your appeal' should be 'CANNOT START YET'
    When they click on 'Upload documents from your planning application' section and are on the 'Planning application form' page
    And they upload a valid file and click Continue button
    And they use 'Back' link to navigate back to the Task list page from 'planning application number' page
    Then status of the 'Upload documents from your planning application' section should be 'IN PROGRESS'
    And the status of 'Check your answers and submit your appeal' should be 'CANNOT START YET'
    When they click on 'Upload documents for your appeal' section and are on the 'Your appeal statement' page
    And they upload a valid file with no sensitive information and click Continue button
    And they use 'Back' link to navigate back to the Task list page from 'New plans or drawings' page
    Then status of the 'Upload documents for your appeal' section should be 'IN PROGRESS'
    And the status of 'Check your answers and submit your appeal' should be 'CANNOT START YET'

    # COMPLETED status is tested in the Check Your Answers Feature file




