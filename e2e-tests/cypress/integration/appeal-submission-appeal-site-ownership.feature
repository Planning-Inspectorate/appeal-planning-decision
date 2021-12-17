Feature: Prospective Appellant provides the Appeal Site Ownership
  Prospective appellant asked to notify the owners of the appeal site where necessary
  Note: This feature describes behaviour for a newly created appeal

  Scenario: No confirmation of ownership of the whole site provided
    Given the site ownership is presented for the first time
    When no confirmation is provided that the whole site is owned
    Then confirmation of whole site ownership is requested
    And Ownership of the appeal site section is "NOT STARTED"

  Scenario: Confirmation that the whole site is owned
    Given the site ownership is presented for the first time
    When it is confirmed that the whole site is owned
    Then a request to confirm access to the site is presented
    And the site is updated to be wholly owned on the appeal
    And Ownership of the appeal site section is "COMPLETED"

  Scenario: Confirmation that the whole site is not owned
    Given the site ownership is presented for the first time
    When it is confirmed that the whole site is not owned
    Then a request to notify additional owners is presented
    And the site is updated to not be wholly owned on the appeal
    And Ownership of the appeal site section is "IN PROGRESS"

  Scenario: No confirmation of additional site owners notification
    Given confirmation of additional site owners notification is requested
    When no confirmation of notification of additional site owners is provided
    Then confirmation of notification of additional site owners is requested
    And Ownership of the appeal site section is "IN PROGRESS"

  Scenario: Confirmation that additional site owners have been notified
    Given confirmation of additional site owners notification is requested
    When it is confirmed that additional site owners have been notified
    Then a request to confirm access to the site is presented
    And the site is updated so that other owners been notified on the appeal
    And  Ownership of the appeal site section is "COMPLETED"

  Scenario: Confirmation that additional site owners have not been notified
    Given confirmation of additional site owners notification is requested
    When it is confirmed that additional site owners have not been notified
    Then a request to confirm access to the site is presented
    And the site is updated to not be wholly owned on the appeal
    And the site is updated so that other owners have not been notified on the appeal
    And Ownership of the appeal site section is "COMPLETED"

  Scenario: Confirmation that the whole site is owned when previously identified as not owned
    Given the whole site had previously been confirmed as not owned
    When it is confirmed that the whole site is owned
    Then a request to notify additional owners is not presented
    And the site is updated to be wholly owned on the appeal
    And Ownership of the appeal site section is "COMPLETED"

  Scenario: Confirmation that the whole site is not owned when previously identified as owned
    Given the whole site had previously been confirmed as owned
    When it is confirmed that the whole site is not owned
    Then a request to notify additional owners is presented
    And the site is updated to not be wholly owned on the appeal
    And Ownership of the appeal site section is "IN PROGRESS"
