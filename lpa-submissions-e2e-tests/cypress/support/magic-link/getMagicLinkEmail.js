import getNotificationEmail from '../common/getNotificationEmail';

module.exports = async () => {
  return cy.get('@lpaEmail').then((lpaEmail) => {
    return getNotificationEmail(lpaEmail);
  });
};
