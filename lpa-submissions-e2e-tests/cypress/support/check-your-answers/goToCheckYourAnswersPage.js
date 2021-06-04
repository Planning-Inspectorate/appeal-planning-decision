import defaultAppealId from '../../utils/defaultPathId';

module.exports = (appealId = defaultAppealId) => {
  cy.goToPage('confirm-answers', appealId);
};
