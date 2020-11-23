Feature: A prospective appellant supplies a Local Planning Department for the case they wish to appeal
    I need to provide the name of the local planning department that rejected my case?
    so that ?.

  Scenario: Local Planning Department is required
    When the prospective appellant does not provide a Local Planning Department
    Then the prospective appellant is informed that a Local Planning Department is required

  Scenario: Some Local Planning Departments are not participating in this service
    When the prospective appellant provides a Local Planning Department that is not participating in this service
    Then the prospective appellant is informed that the selected Local Planning Department is not participating in the service
    And the prospective appellant is directed to the Appeal a Planning Decision service

  Scenario: Local Planning Department is successfully provided
    When the prospective appellant provides a Local Planning Department that is participating in this service
    Then the prospective appellant can proceed with the provided Local Planning Department
