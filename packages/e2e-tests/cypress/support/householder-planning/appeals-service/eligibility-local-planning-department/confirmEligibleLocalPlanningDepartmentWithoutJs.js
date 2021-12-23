import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmEligibleLocalPlanningDepartmentWithoutJs = () => {
  cy.get('[data-cy="eligible-departments"]').invoke('text')
    .then((departments) => {
      let lastEligibleLocalPlanningDepartment = '';
      const eligiblePlanningDepartments = departments.toString().split(',');
      if (eligiblePlanningDepartments.length > 0) {
        lastEligibleLocalPlanningDepartment = eligiblePlanningDepartments[eligiblePlanningDepartments.length-1];
      }

      goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPageWithoutJs);
      cy.get('[data-cy="eligible-departments"]').should('have.value', lastEligibleLocalPlanningDepartment);

      goToAppealsPage(pageURLAppeal.goToCheckYourAnswersPage);
      cy.get('[data-cy="eligible-departments"]').first().should('contain', lastEligibleLocalPlanningDepartment);
    })
}
