import getNotificationEmail from '../../../common/getNotificationEmail';

export const getMagicLinkEmail = () => {
  return cy.get('@lpaEmail').then((lpaEmail) => {
    return getNotificationEmail(lpaEmail).then((response) => {
      const emails = response?.body;
      if (emails && emails.length > 0) {
        return emails[0];
      }
      return null;
    });
  });
};
