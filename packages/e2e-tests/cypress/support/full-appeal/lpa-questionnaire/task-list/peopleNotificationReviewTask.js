import {peopleNotificationTask} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const peopleNotificationReviewTask = () =>{
  peopleNotificationTask().should('be.visible')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('Tell us how you notified people about the application')
    });

  peopleNotificationTask().siblings('.govuk-tag')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('NOT STARTED')
    });
}
