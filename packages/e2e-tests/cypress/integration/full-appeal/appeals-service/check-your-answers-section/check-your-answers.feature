Feature: As an Appellant/Agent
  I want to be able to review and change my answers
  So that my appeal is accurate

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario Outline: AC01- Appellant has submitted the application with '<contact_details>', own land as '<own_land>', agricultural holding as '<agricultural_holding>, visible from public land as '<visible_publicLand>', health and safety as '<health_and_safety>', '<appeal_decision>', design and access statement as '<design_access_statement>', plans and drawings as '<plans_and_drawings>' and supporting documents as '<supporting_documents>'
    Given the appellant has provided details for '<contact_details>'
    And appellant provides the details for '<own_land>', '<agricultural_holding>', '<visible_publicLand>' and '<health_and_safety>'
    And appellant provides the details about '<appeal_decision>' preference
    And appellant uploads documents from planning application and design and access statement as '<design_access_statement>'
    And appellant uploads documents for appeal for plans and drawings '<plans_and_drawings>' and supporting documents '<supporting_documents>'
    When appellant clicks on Check your answers link
    Then appellant is displayed the check your answer page
    And appellant is displayed answers for '<contact_details>'
    And appellant is displayed answers for appeal site for '<own_land>', '<agricultural_holding>', '<visible_publicLand>' and '<health_and_safety>'
    And appellant is displayed answers for deciding your appeal for '<appeal_decision>'
    And appellant is displayed answers for planning application for '<design_access_statement>'
    And appellant is displayed answers for appeal for '<plans_and_drawings>' and '<supporting_documents>'
    Examples:
      | contact_details | own_land | agricultural_holding | visible_publicLand | health_and_safety | appeal_decision         | design_access_statement | plans_and_drawings | supporting_documents |
      | appellant       | yes      | no                   | yes                | no                | Written representations | no                      | no                 | no                   |
    #  | agent           | yes      | no                   | yes                | no                | Written representations | no                      | no                 | no                   |
      | appellant       | yes      | no                   | yes                | no                | Hearing                 | no                      | no                 | no                   |
   #   | agent           | yes      | no                   | yes                | no                | Hearing                 | no                      | no                 | no                   |
      | appellant       | yes      | no                   | yes                | no                | Inquiry                 | no                      | no                 | no                   |
    #  | agent           | yes      | no                   | yes                | no                | Inquiry                 | no                      | no                 | no                   |
    #  | appellant       | yes      | no                   | yes                | no                | Written representations | yes                      | no                 | no                   |
    #  | agent           | yes      | no                   | yes                | no                | Written representations | yes                      | no                 | no                   |
#      | appellant       | yes      | no                   | yes                | no                | Written representations | no                      | no                 | no                   |
#      | agent           | yes      | no                   | yes                | no                | Written representations | no                      | no                 | no                   |
#      | appellant       | yes      | no                   | yes                | no                | Written representations | no                      | no                 | no                   |
#      | agent           | yes      | no                   | yes                | no                | Written representations | no                      | no                 | no                   |
