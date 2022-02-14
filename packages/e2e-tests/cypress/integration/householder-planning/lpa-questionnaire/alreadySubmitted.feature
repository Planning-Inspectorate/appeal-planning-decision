@wip
Feature:
    As a LPA Planning Officer
    I want to be redirected to already-submitted page
    So that Completed questionnaire cannot be submitted twice

    Background:
      Given an appeal has been created
      And a questionnaire has been created
      And the questionnaire has been completed

   Scenario Outline: LPA Officer navigates to any page of submitted questionnaire
      Given the LPA Questionnaire is submitted
      When the LPA Planning Officer is trying to access <page> of already submitted questionnaire
      Then the LPA Planning Officer is presented with already submitted page
      And the Already Submitted page should have Enquiries Email link
      And the Already Submitted page should have link to Call charges
      Examples:
        | page                                              |
        | "task list"                                       |
        | "Review accuracy of the appellant submission"     |
        | "Extra conditions"                                |
        | "Other appeals"                                   |
        | "See appeal site from public land"                |
        | "Need to enter the appeal site"                   |
        | "Access to neighbours land"                       |
        | "Health and Safety issues"                        |
        | "Affect setting of listed building"               |
        | "In Green belt"                                   |
        | "Near conservation area"                          |
        | "Plans used to reach decision"                    |
        | "Planning officers report"                        |
        | "Interested parties"                              |
        | "Interested parties representation"               |
        | "Notify interested parties"                       |
        | "Publicise original planning application"         |
        | "Site Notices"                                    |
        | "Conservation area map and guidance"              |
        | "Planning History"                                |
        | "Other relevant policies"                         |
        | "Statutory development plan policy"               |
        | "Supplementary planning documents"                |
        | "Development Plan Document or Neighbourhood Plan" |
        | "Check your answers"                              |
