@smoketest @e2e
Feature: As an Appellant/Agent
  I want to be able to review and change my answers
  So that my appeal is accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario Outline: <Acceptance_criteria>- <description>
    Given the appellant has provided details for '<contact_details>' and status is 'COMPLETED'
    And appellant provides the details for '<own_land>', '<own_some_land>', '<owns_rest_of_land>', '<agricultural_holding>', '<visible_publicLand>', '<tenant>', '<other_tenants>' and '<health_and_safety>' and status is 'COMPLETED'
    And appellant provides the details about '<appeal_decision>' preference and status is 'COMPLETED'
    And appellant uploads documents from planning application and design and access statement as '<design_access_statement>' and status is 'COMPLETED'
    And appellant uploads documents for appeal for plans and drawings '<plans_and_drawings>' and supporting documents '<supporting_documents>' and status is 'COMPLETED'
    When appellant clicks on Check your answers link
    Then appellant is displayed the check your answer page
    And appellant is displayed answers for '<contact_details>'
    And appellant is displayed answers for appeal site for '<own_land>', '<own_some_land>', '<owns_rest_of_land>', '<agricultural_holding>', '<visible_publicLand>', '<tenant>', '<other_tenants>' and '<health_and_safety>'
    And appellant is displayed answers for deciding your appeal for '<appeal_decision>'
    And appellant is displayed answers for planning application for '<design_access_statement>'
    And appellant is displayed answers for appeal for '<plans_and_drawings>' and '<supporting_documents>'
    Examples:
      | Acceptance_criteria | description                                                                                                       | contact_details | own_land | own_some_land | owns_rest_of_land                          | agricultural_holding | tenant | other_tenants | health_and_safety | visible_publicLand | appeal_decision         | design_access_statement | plans_and_drawings | supporting_documents |
      | AC-01               | Appellant owns all the land and appeal decision is written representations                                        | appellant       | yes      | no            | Yes, I know who owns all the land          | no                   | yes    | yes           | no                | yes                | Written representations | no                      | no                 | no                   |
      | AC-02               | Agent - Appellant owns all the land and appeal decision is Hearing                                                | agent           | yes      | no            | Yes, I know who owns all the land          | no                   | yes    | yes           | no                | yes                | Hearing                 | no                      | no                 | no                   |
      | AC-03               | Appellant owns all the land and appeal decision is Inquiry                                                        | appellant       | yes      | no            | Yes, I know who owns all the land          | no                   | yes    | yes           | no                | yes                | Inquiry                 | no                      | no                 | no                   |
      | AC-04               | Agent - Appellant owns all the land and provides design access statement                                          | agent           | yes      | no            | Yes, I know who owns all the land          | no                   | yes    | yes           | no                | yes                | Written representations | yes                     | no                 | no                   |
      | AC-05               | Appellant owns some of the land and knows all the owners and provides plans and drawings and supporting documents | appellant       | no       | yes           | Yes, I know who owns all the land          | yes                  | yes    | no            | yes               | no                 | Written representations | no                      | yes                | yes                  |
      | AC-06               | Appellant owns some of the land and knows some of the owners and is the only tenant of agricultural holding       | appellant       | no       | yes           | I know who owns some of the land           | yes                  | yes    | no            | yes               | no                 | Written representations | no                      | yes                | yes                  |
      | AC-07               | Appellant owns some of the land and knows none of the owners and is one of the tenants of agricultural holding    | appellant       | no       | yes           | No, I do not know who owns any of the land | yes                  | yes    | yes           | no                | yes                | Written representations | no                      | yes                | yes                  |
      | AC-08               | Appellant owns none of the land and knows all of the owners and is one of the tenants of agricultural holding     | appellant       | no       | no            | Yes, I know who owns all the land          | yes                  | yes    | yes           | yes               | no                 | Written representations | no                      | yes                | yes                  |
      | AC-09               | Appellant owns none of the land and knows some of the owners and is one of the tenants of agricultural holding    | appellant       | no       | no            | I know who owns some of the land           | yes                  | yes    | no            | yes               | no                 | Written representations | no                      | yes                | yes                  |
      | AC-10               | Appellant owns none of the land and knows none of the owners and is the only tenants of agricultural holding      | appellant       | no       | no            | No, I do not know who owns any of the land | yes                  | yes    | no            | no                | yes                | Written representations | no                      | yes                | yes                  |
