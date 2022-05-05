@has
Feature: Task lists
  As a prospective appellant I want to clearly see which sections of the
  appeal submission I have completed, so that I do not waste my time checking.

  Initially all the tasks are "NOT STARTED", once the appellant has provided required information they are "COMPLETED"
  Some tasks could be multi steps and if not all steps are completed, then the task is considered "IN PROGRESS"

  The "Check your answer" task state should be "CANNOT START YET" until all mandatory tasks are "COMPLETED"

  Scenario Outline: When the tasks are presented, then they should able to be selected
    Given the appeal tasks are presented
    And the task <task> is available for selection
    Examples:
      | task                                            |
      | "About you - Your details"                      |
      | "Planning application - Application number"     |
      | "Planning application - Upload application"     |
      | "Planning application - Upload decision letter" |
      | "Your appeal - Appeal statement"                |
      | "Your appeal - Supporting documents"            |
      | "Appeal site - Site location"                   |
      | "Appeal site - Site ownership"                  |
      | "Appeal site - Site access"                     |
      | "Appeal site - Site safety"                     |


  Scenario Outline: When the appeal is not started, then the tasks are in "NOT STARTED" state
    Given the <task> part of the appeal is not started
    When the appeal tasks are presented
    Then the state for <task> is displayed to be "NOT STARTED"
    Examples:
      | task                                            |
      | "About you - Your details"                      |
      | "Planning application - Application number"     |
      | "Planning application - Upload application"     |
      | "Planning application - Upload decision letter" |
      | "Your appeal - Appeal statement"                |
      | "Your appeal - Supporting documents"            |
      | "Appeal site - Site location"                   |
      | "Appeal site - Site ownership"                  |
      | "Appeal site - Site access"                     |
      | "Appeal site - Site safety"                     |

  Scenario Outline: When the appeal is completed, then the tasks are in "COMPLETED" state
    Given the <task> part of the appeal are completed
    When the appeal tasks are presented
    Then the state for <task> is displayed to be "COMPLETED"
    Examples:
      | task                                            |
      | "About you - Your details"                      |
      | "Planning application - Application number"     |
      | "Planning application - Upload application"     |
      | "Planning application - Upload decision letter" |
      | "Your appeal - Appeal statement"                |
      | "Your appeal - Supporting documents"            |
      | "Appeal site - Site location"                   |
      | "Appeal site - Site ownership"                  |
      | "Appeal site - Site access"                     |
      | "Appeal site - Site safety"                     |

  Scenario Outline: When the tasks are started but not completed, then there are in "IN PROGRESS" state
    Given the <task> part of the appeal is started but not completed
    When the appeal tasks are presented
    Then the state for <task> is displayed to be "IN PROGRESS"
    Examples:
      | task                           |
      | "About you - Your details"     |
      | "Appeal site - Site ownership" |

  Scenario: When mandatory tasks are not completed, then Check your answers task is not available
    Given mandatory tasks are not completed
    When the appeal tasks are presented
    Then the state for "Appeal submit - Check your answers" is displayed to be "CANNOT START YET"
    And the task "Appeal submit - Check your answers" is not available for selection

  Scenario: When mandatory tasks are completed, then Check your answers task is available
    Given mandatory tasks are completed
    When the appeal tasks are presented
    Then the state for "Appeal submit - Check your answers" is displayed to be "NOT STARTED"
    And the task "Appeal submit - Check your answers" is available for selection
