@wip
Feature: Appeal submission to Horizon - other Appellant submission scenarios

As a case officer
I want to know how the appeal site can be accessed
so that I can book an appropriate site visit with a Planning Inspector and site owner

  @as-105 @as-105-ac1.1
  Scenario: AC1.1 Appeal information submitted where the whole site can be seen from a public road
    Given a prospective appellant has provided appeal information where the whole site can be seen
    When the appeal is submitted
    Then a case is created for a case officer where an inspector does not require site access
   
  @as-105 @as-105-ac1.2
  Scenario: AC1.2 Appeal information submitted where the whole site cannot be seen from a public road
    Given a prospective appellant has provided appeal information where the whole site cannot be seen
    When the appeal is submitted
    Then a case is created for a case officer where an inspector requires site access

  @as-105 @as-105-ac2.1
  Scenario: AC2.2 Appellant is the owner of the whole site
    Given a prospective appellant has provided appeal information where they own the whole site
    When the appeal is submitted
    Then a case is created for a case officer with Certificate A

    
  @as-105 @as-105-ac2.2a
  Scenario: AC2.2a Appellant is not the owner of the whole site - has informed owner
    Given a prospective appellant has provided appeal information where they do not own the whole site
    When the appeal is submitted
    Then a case is created for a case officer without Certificate A

  @as-105 @as-105-ac2.2b 
  Scenario: AC2.2b Appellant is not the owner of the whole site - has not informed owner
    Given a prospective appellant has provided appeal information where they do not own the whole site
    When the appeal is submitted
    Then a case is created for a case officer without Certificate A





    