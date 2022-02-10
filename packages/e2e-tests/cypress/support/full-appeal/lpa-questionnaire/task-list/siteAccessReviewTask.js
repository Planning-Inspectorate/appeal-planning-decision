import {procedureTypeTask, siteAccessTask} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const siteAccessReviewTask = () => {
  siteAccessTask().should('be.visible')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('Tell the Inspector about site access')
    });

  siteAccessTask().siblings('.govuk-tag')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('NOT STARTED')
    });
}
