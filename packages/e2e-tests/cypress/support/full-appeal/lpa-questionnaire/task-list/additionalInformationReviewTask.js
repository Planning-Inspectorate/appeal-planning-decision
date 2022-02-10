import {additionalInformationTask} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const additionalInformationReviewTask = () =>{
  additionalInformationTask().should('be.visible')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('Provide additional information for the Inspector')
    });

  additionalInformationTask().siblings('.govuk-tag')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('NOT STARTED')
    });
}
