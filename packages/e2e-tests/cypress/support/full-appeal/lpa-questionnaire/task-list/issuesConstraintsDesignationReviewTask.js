import {
  issuesConstraintsDesignationTask
} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const issuesConstraintsDesignationReviewTask = () =>{
  issuesConstraintsDesignationTask().should('be.visible')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('Tell us about constraints, designations and other issues')
    });

  issuesConstraintsDesignationTask().siblings('.govuk-tag')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('NOT STARTED')
    });
}
