import {planningOfficerReportTask, procedureTypeTask} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const planningOfficerReportReviewTask = ()=> {
  planningOfficerReportTask().should('be.visible')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain("Upload the Planning Officer's report and relevant policies")
    });

  planningOfficerReportTask().siblings('.govuk-tag')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain('NOT STARTED')
    });
}
