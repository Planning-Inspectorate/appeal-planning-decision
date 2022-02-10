import {decisionNoticeTask, procedureTypeTask} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const decisionNoticeReviewTask = () =>{
  decisionNoticeTask().should('be.visible')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('Tell us what your decision notice would have said and provide relevant policies')
    });

  decisionNoticeTask().siblings('.govuk-tag')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('NOT STARTED')
    });
}
