const { goToAppealsPage } = require('../../../common/go-to-page/goToAppealsPage');
export const visitServiceStartPage = (options = {}) => {
  goToAppealsPage('', { failOnStatusCode: false, ...options });
};
