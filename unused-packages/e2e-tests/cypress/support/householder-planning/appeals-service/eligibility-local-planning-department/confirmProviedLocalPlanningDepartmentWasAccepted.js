export const confirmProviedLocalPlanningDepartmentWasAccepted = () => {
	cy.url().should('include', '/eligibility/listed-building');
};
