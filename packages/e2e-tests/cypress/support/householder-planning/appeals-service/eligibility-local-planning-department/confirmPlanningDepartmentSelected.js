import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmPlanningDepartmentSelected = (planningDepartment) => {
  goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPage);
  cy.get('input#local-planning-department').should('have.value', planningDepartment);

  goToAppealsPage(pageURLAppeal.goToCheckYourAnswersPage);
  cy.get('[data-cy="local-planning-department"]').first().should('contain', planningDepartment);
};
