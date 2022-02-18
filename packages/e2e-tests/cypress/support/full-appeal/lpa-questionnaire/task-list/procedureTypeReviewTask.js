import {procedureTypeTask} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const procedureTypeReviewTask = () =>{
  procedureTypeTask().should('be.visible')
    .invoke('text')
    .then((text)=>{
    expect(text).to.contain('Review the procedure type')
  });

  procedureTypeTask().siblings('.govuk-tag')
    .invoke('text')
    .then((text)=>{
    expect(text).to.contain('NOT STARTED')
  });
}
