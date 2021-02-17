Feature: Appeals Extra Conditions
  As a beta LPA I want to inform the Planning Inspectorate of any extra conditions I wish to be attached to the appeal decision (over and above the standard ones)
So that the Inspector can decide whether or not to attach them to their decision.

Scenario: AC01 - User navigates to 'Do you have extra conditions' page
  Given The Householder planning appeal questionnaire page is presented
  When the user selects the link 'Do you have any extra conditions?'
  Then the user is presented with the 'Do you have any extra conditions?' page
  And the Page title is 'Do you have any extra conditions? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'
