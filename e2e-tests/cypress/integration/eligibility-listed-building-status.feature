Feature: A prospective appellant supplies states whether or not their appeal covers a listed building
    I need to provide the listed status of the building?
    so that I don't accidentally submit an appeal against a decision made about a listed building?

  Scenario: Listed Building statement is required
    When the prospective appellant does not provide a Listed Building statement
    Then the prospective appellant is informed that a Listed Building statement is required

  Scenario: User selects yes option in the Is your appeal about a listed building page
    When the prospective appellant states that their case concerns a Listed Building
    Then the prospective appellant is informed that cases concerning a Listed Building cannot be processed via this service
    And the prospective appellant is directed to the Appeal a Planning Decision service

  Scenario: User selects no option in the Is your appeal about a listed building page
    When the prospective appellant states that their case does not concern a Listed Building
    Then the prospective appellant can proceed with a non-Listed Building
