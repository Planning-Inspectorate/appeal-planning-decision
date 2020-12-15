@wip
@UI-ONLY
Feature: Appeal Submission Save and Continue Navigation
    As a prospective appellant, I want to be taken through the submission process efficiently so that I do not get confused

    Scenario: A prospective appellant is on About You sub-section that is not the last part of a section
        Given a prospective appellant is on the "who-are-you" sub-section of "About you"
        When "Save & Continue" is selected
        Then the user is taken to the next sub-section of about you

    Scenario Outline: A prospective appellant is on about the original planning application sub-section that is not the last part of a section
        Given a prospective appellant is on the sub section <sub-section> of <section>
        When "Save & Continue" is selected
        Then the user is taken to the next sub-section of <section>
        Examples:
            | section                                 | sub-section                                   |
            | About the original planning application | Planning application number                   |
            | About the original planning application | Upload the original planning application form |

    Scenario Outline: A prospective appellant is on about your appeal sub-section that is not the last part of a section
        Given a prospective appellant is on the sub section <sub-section> of <section>
        When "Save & Continue" is selected
        Then the user is taken to the next sub-section of <section>
        Examples:
            | section           | sub-section                                 |
            | About your appeal | Your appeal statement                       |
            | About your appeal | Any other documents to support your appeal |

    Scenario Outline: A prospective appellant is on visiting the appeal site sub-section that is not the last part of a section
        Given a prospective appellant is on the sub section <sub-section> of <section>
        When "Save & Continue" is selected
        Then the user is taken to the next sub-section of <section>
        Examples:
            | section                  | sub-section                  |
            | Visiting the appeal site | Address of the appeal site   |
            | Visiting the appeal site | Ownership of the appeal site |
            | Visiting the appeal site | Access to the appeal site    |

    Scenario Outline: A prospective appellant is on a sub-section that is the last part of a section
        Given a prospective appellant is on the last sub-section <sub-section> of <section>
        When "Save & Continue" is selected
        Then the user is taken to the Appeal Submission Tasklist
        Examples:
            | section                                 | sub-section                  |
            | About you                               | About you                    |
            | About the original planning application | Upload the decision letter   |
            | About your appeal                       | Other relevant appeals       |
            | Visiting the appeal site                | Any health and safety issues |
