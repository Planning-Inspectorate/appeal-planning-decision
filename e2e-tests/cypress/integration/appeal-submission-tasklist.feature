Feature: Task lists - Section status
  As a prospective appellant I want to clearly see which sections of the
  appeal submission I have completed, so that I do not waste my time checking

  Initially all the tasks are "NOT STARTED", once the appellant has provided required information they are "COMPLETED"
  Some tasks could be multi steps and if not all steps are completed, then the task is considered "IN PROGRESS"

  Scenario Outline: All the tasks are in "NOT STARTED" state
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

  Scenario Outline: All the tasks are in "COMPLETED"
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


  Scenario Outline: All the tasks that can be in "IN PROGRESS" state
    Given the <task> part of the appeal is started but not completed
    When the appeal tasks are presented
    Then the state for <task> is displayed to be "IN PROGRESS"
    Examples:
      | task                           |
      | "About you - Your details"     |
      | "Appeal site - Site ownership" |

