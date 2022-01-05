const { yourAppealDetailsPageHeadingSelector } = require('./selectors');
const { goToAppealsPage } = require('../../../common/go-to-page/goToAppealsPage');

const defaultOptions = { script: true, failOnStatusCode: true };

export const appellantViewsYourAppealDetailsInvalid = ({ script, failOnStatusCode } = defaultOptions) => {
  goToAppealsPage('your-planning-appeal/your-appeal-details', { script, failOnStatusCode });
};
