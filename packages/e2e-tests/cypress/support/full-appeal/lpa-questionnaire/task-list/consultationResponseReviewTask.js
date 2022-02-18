import {consultationResponseTask} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const consultationResponseReviewTask = () => {
  consultationResponseTask().should('be.visible')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('Upload consultation responses and representations')
    });

  consultationResponseTask().siblings('.govuk-tag')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('NOT STARTED')
    });
}
