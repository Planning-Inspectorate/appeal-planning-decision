Feature: Send email notification
  As an appellant/agent
  I want to receive confirmation of my appeal by email
  So that I have a copy for my records

Scenario: Send email confirmation to appellant
  Given an appellant has prepared an appeal
  When the appeal is submitted
  Then a confirmation email containing a link to the appeal pdf is sent to the appellant

Scenario: Send email confirmation to agent
  Given an agent has prepared an appeal
  When the appeal is submitted
  Then a confirmation email containing a link to the appeal pdf is sent to the agent
