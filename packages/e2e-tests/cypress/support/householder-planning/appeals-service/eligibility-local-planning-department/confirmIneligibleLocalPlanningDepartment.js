import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmIneligibleLocalPlanningDepartment = () => {
  cy.get('[data-cy="ineligible-departments"]').invoke('text')
    .then((departments) => {
      let firstIneligibleLocalPlanningDepartment = '';
      const ineligiblePlanningDepartments = departments.toString().split(',');
      if (ineligiblePlanningDepartments.length > 0) {
        firstIneligibleLocalPlanningDepartment = ineligiblePlanningDepartments[0];
      }

      goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPage);
      cy.get('input#local-planning-department').should('have.value', firstIneligibleLocalPlanningDepartment);

      goToAppealsPage(pageURLAppeal.goToCheckYourAnswersPage);
      cy.get('[data-cy="local-planning-department"]').first().should('contain', firstIneligibleLocalPlanningDepartment);
    })
}
