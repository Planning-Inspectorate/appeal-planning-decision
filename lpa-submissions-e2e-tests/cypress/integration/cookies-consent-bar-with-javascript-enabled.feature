Feature: Cookie consent bar - with JS

  As a performance analyst working on the LPA Questionnaire
  I want users to be able to say Yes to GA cookies
  So that I will receive analytics data for the service

  Scenario: Cookie banner available until actioned - no decision
    Given a user has not previously submitted cookie preferences
    When the user neither accepts nor rejects not necessary cookies
    Then the cookie banner remains visible

  Scenario: Cookie banner available until actioned - accepted
    Given a user has not previously submitted cookie preferences
    When the user accepts not necessary cookies
    Then the accepted cookie banner becomes visible

  Scenario: Cookie banner available until actioned - rejected
    Given a user has not previously submitted cookie preferences
    When the user rejects not necessary cookies
    Then the rejected cookie banner becomes visible

  Scenario: Accept not necessary cookies
    Given a user has not previously submitted cookie preferences
    When the user accepts not necessary cookies
    Then the GA cookies are enabled

  Scenario: Reject Not necessary Cookies
    Given a user has not previously submitted cookie preferences
    When the user rejects not necessary cookies
    Then the GA cookies remain disabled
