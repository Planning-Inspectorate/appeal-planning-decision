import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

const { yourAppealDetailsPageHeadingSelector } = require('./selectors');

const defaultOptions = { script: true, failOnStatusCode: true };

export const appellantViewsYourAppealDetailsInvalid = ({ script, failOnStatusCode } = defaultOptions) => {
  goToAppealsPage('your-planning-appeal/your-appeal-details', { script, failOnStatusCode });
};
