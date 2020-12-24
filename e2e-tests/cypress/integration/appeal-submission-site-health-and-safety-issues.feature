@wip
Feature: Appellant submission - Health and safety issues
  As an Inspector I need to understand if there are any H&S concerns at the appeal site so that I can plan
  my site visit accordingly

# Previously did not select any option and when I navigate to this page from task list none of the options is selected
  Scenario: Opportunity to provide health and safety issues is presented
    Given the status of the appeal section is displayed
    When health and safety issues is accessed
    Then the opportunity to provide health and safety issues is presented

# Previously selected value is 'No' and when I navigate to this page from task list, I see option 'No' is selected
  Scenario: Opportunity to provide health and safety issues is presented showing no issues
    Given the status of the appeal section is displayed
    When health and safety issues is accessed
    Then no health and safety issues is presented

# Previously selected value is 'Yes' along with concerns and when I navigate from task list to this page, I see option 'Yes' with concerns is presented
  Scenario: Opportunity to provide health and safety issues is presented showing issues and concerns
    Given the status of the appeal section is displayed
    When health and safety issues is accessed
    Then health and safety issues along with conerns is presented

 # Required in Then statement means a validation message should be displayed
  Scenario: Confirmation of health and safety issues not provided
    Given confirmation of health and safety issues is requested
    When no confirmation of health and safety issues is provided
    Then appeal is not updated because confirmation of health and safety issues is required

  Scenario: Confirmation provided of health and safety issues-Exceeds character limit
    Given confirmation of health and safety issues is requested
    When confirmation of health and safety issues is provided along with concerns exceeding the limit
    Then appeal is not updated because the health and safety concerns exceed the limit

 # Required in Then statement means a validation message should be displayed
  Scenario: Health and safety issues present but concerns not provided
    Given confirmation of health and safety issues is requested
    When confirmation of health and safety issues is provided without concerns
    Then appeal is not updated because health and safety concerns are required

  Scenario: Confirmation provided of health and safety concerns
    Given confirmation of health and safety issues is requested
    When confirmation of health and safety issues is provided along with concerns
    Then appeal is updated with health and safety issues and concerns and the appeal tasks are presented

  Scenario: Confirmation provided no health and safety issues
    Given confirmation of health and safety issues is requested
    When confirmation of no health and safety issues is provided
    Then appeal is updated with no health and safety issues and the appeal tasks are presented

  Scenario: Confirmation indicated with health and safety issues-update the appeal with no health and safety issues
    Given health and safety issues along with concerns have been indicated
    When confirmation of no health and safety issues is provided
    Then appeal is updated with no health and safety issues and the appeal tasks are presented

  Scenario: Confirmation indicated with no health and safety issues-update the appeal with health and safety issues
    Given no health and safety concerns have been indicated
    When confirmation of health and safety issues is provided along with concerns
    Then appeal is updated with health and safety issues and concerns and the appeal tasks are presented

# Indicated means not saved(save and continue button is not selected)
  Scenario: Confirmation provided with no health and safety issues-replace the present selection of health and safety concerns
    Given Health and safety issues and concerns previously indicated followed by an indication of no issues
    When health and safety issues are indicated
    Then health and safety issues along with concerns are presented

# We expect the concerns to be cleared in the below scenario
  Scenario: Confirmation provided with health and safety concerns-replace the present selection of no health and safety issues
    Given health and safety issues along with concerns have been provided
    When confirmation of no health and safety issues is provided
    Then appeal is updated with no health and safety issues and the appeal tasks are presented
