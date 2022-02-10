import {applicationStatus, applicationStatusDetailed} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const applicationStatusDetails = () =>{
  applicationStatus().should('be.visible')
    .invoke('text').then((text)=>{
      expect(text).to.contain('Questionnaire incomplete')
  });

  applicationStatusDetailed().should('be.visible')
    .invoke('text').then((text)=>{
    expect(text).to.contain('You have completed 0 of 9 tasks.');
  });
}
