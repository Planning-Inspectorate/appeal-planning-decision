import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmEligibleLocalPlanningDepartment = () => {
  cy.get('[data-cy="eligible-departments"]').invoke('text')
    .then((departments) => {
      let lastEligibleLocalPlanningDepartment = '';
      const eligiblePlanningDepartments = departments.toString().split(',');
      if (eligiblePlanningDepartments.length > 0) {
        lastEligibleLocalPlanningDepartment = eligiblePlanningDepartments[eligiblePlanningDepartments.length-1];
      }

      goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPage);
      cy.get('input#local-planning-department').should('have.value', lastEligibleLocalPlanningDepartment);

      goToAppealsPage(pageURLAppeal.goToCheckYourAnswersPage);
      cy.get('[data-cy=local-planning-department]').first().should('contain', lastEligibleLocalPlanningDepartment);
    })
}
