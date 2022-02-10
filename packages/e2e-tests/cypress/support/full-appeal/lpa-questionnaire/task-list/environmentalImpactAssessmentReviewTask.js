import {
  environmentalImpactAssessmentTask
} from "../pageObjects/full-planning-questionnaire-task-list-po";

export const environmentalImpactAssessmentReviewTask = () =>{
    environmentalImpactAssessmentTask().should('be.visible')
      .invoke('text')
      .then((text)=>{
        expect(text).to.contain("Tell us if it's an environmental impact assessment development")
      });

    environmentalImpactAssessmentTask().siblings('.govuk-tag')
      .invoke('text')
      .then((text)=>{
        expect(text).to.contain('NOT STARTED')
      });
}
