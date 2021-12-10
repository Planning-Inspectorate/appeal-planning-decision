class AppealDetailsSidebar {
  getAppealDetailsSidebar() {
    return cy.get('[data-cy="appealDetails"]');
  }

  getPlanningApplicationNumber() {
    return cy.get('[data-cy="planningApplicationNumber"]');
  }

  getPlanningApplicationAddress() {
    return cy.get('[data-cy="planningApplicationAddress"]');
  }

  getPlanningApplicationAppellant() {
    return cy.get('[data-cy="planningApplicationApellant"]');
  }
}

export default AppealDetailsSidebar;
