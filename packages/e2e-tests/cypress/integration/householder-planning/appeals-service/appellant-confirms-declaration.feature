Feature: Declaration must be agreed before a submission can be made

  Scenario: Prospective appellant does not agree to the declaration
    Given an appeal is ready to be submitted
    When the declaration is not agreed
    Then no submission confirmation is presented

  Scenario: Prospective appellant agree to the declaration
    Given an appeal is ready to be submitted
    When the declaration is agreed
    Then the submission confirmation is presented
