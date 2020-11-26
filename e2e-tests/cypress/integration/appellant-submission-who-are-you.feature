Feature: A user is asked if he or she's the original appellant
  If the user is not the original appellant, his name should be asked


  Scenario: The user is the original appellant
    When the user answers that he's the original appellant
    Then the user will not be asked who he or she is representing

  Scenario: The user is not the original appellant
    When the user answers that he's not original appellant
    Then the user will be asked who he or she is representing
