require('cypress-wait-until');
require('cypress-axe');

require('./axe');

require('./commands/header-footer-commands');
require('./visit-without-javascript-enabled');
require('./common/commands');
require('./cookies/cookies-commands');
require('./commands/navigation-commands');
require('./commands/eligibility-commands');
require('./commands/submission-commands');
require('./commands/guidance-page-commands');
require('./appeal-submission-information/submission-information-commands');
require('./cookie-consent-view-preferences/commands');
require('./flash-message/flash-message-commands');
require('./back-link/back-link-commands');
require('./eligibility-listed-building-status/listed-building-commands');
require('./errors/commands');
require('./your-planning-appeal/commands');
require('./your-planning-appeal-your-appeal-details/commands');
