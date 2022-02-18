import {procedureTypeTask, questionnaireSubmissionTask} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const questionnaireSubmissionReviewTask = () =>{
  questionnaireSubmissionTask().should('be.visible')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('Check your answers and submit')
    });

  questionnaireSubmissionTask().siblings('.govuk-tag')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('CANNOT START YET')
    });
}
