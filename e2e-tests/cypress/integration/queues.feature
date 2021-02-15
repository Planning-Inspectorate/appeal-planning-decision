@wip
Feature: queues
  As a person writing tests
  I want to be able to make assertions against a message queue
  So that I can validate functionality that involves queueing things

  Scenario: I can get a message off a queue
    Given i am listening to my queue
    When i put "alphabeti spaghetti" on my queue
    Then i can read "alphabeti spaghetti" from my queue
