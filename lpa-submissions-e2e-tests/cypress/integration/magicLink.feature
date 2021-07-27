Feature: LPA Questionnaire Access - Authentication: Magic Link
  As a LPA Planning Officer
  I want to access the LPA questionnaire
  So that I can complete with the information needed by the Planning Inspector

  Background:
    Given an appeal has been created
    And a questionnaire has been created

  Scenario: LPA selects the link in the start email and LPA is asked to provide email address
    Given LPA Planning Officer wants to complete a questionnaire
    When they click on the link in the start email
    Then enter email address page will be displayed

  Scenario: LPA enters email address not matched with the LPA domain -
    Given access to the questionnaire is requested
    When the email address does not match the domain of the LPA from the appeal
    Then progress is made to the confirm your email address page
    And a magic link is not sent to the user

  Scenario: LPA does not enter an email address
    Given access to the questionnaire is requested
    When an email address is not provided
    Then progress is halted with an error message to enter an email address

  Scenario: LPA enters email address in invalid format
    Given access to the questionnaire is requested
    When the email address provided in not in the correct format
    Then progress is halted with an error message to enter an email address

  Scenario: LPA enters email address matching LPA domain
    Given access to the questionnaire is requested
    When a valid email address is provided matching the domain of the LPA
    Then progress is made to the confirm your email address page
    And a magic link is sent to that email address via Notify

  Scenario: LPA selects to Email the customer support team
    Given the LPA is on the confirm your email page
    When they select to email the customer support team
    Then a mailto link will be provided

  Scenario:  LPA does not receive magic link and clicks resend
    Given the LPA is on the confirm your email page
    When they select ‘resend the email’
    Then enter email address page will be displayed

  Scenario: LPA selects valid magic link and accesses the questionnaire
    Given LPA user receives a magic link for accessing the questionnaire
    When they select a valid link
    Then the questionnaire page is presented

  Scenario: LPA selects an expired magic link
    Given LPA user receives a magic link for accessing the questionnaire
    When they select an expired magic link
    Then enter email address page will be displayed
    And a link expired notification banner is displayed on the page

  Scenario: Authentication expired - 4 hours expiry
    Given the session has timed out
    When the LPA tries to access the questionnaire
    Then enter email address page will be displayed
    And a session expired notification banner is displayed on the page

  Scenario: LPA wants to complete a questionnaire and have not authenticated
    Given the LPA Planning Officer has not been authenticated
    When the LPA tries to access the questionnaire
    Then enter email address page will be displayed

  Scenario: LPA wants to view the questionnaire and have been authenticated
    Given the LPA Planning Officer is authenticated
    When the LPA tries to access the questionnaire
    Then the questionnaire page is presented
