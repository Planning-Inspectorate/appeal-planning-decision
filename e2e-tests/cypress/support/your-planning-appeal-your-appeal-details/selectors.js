const yourAppealDetailsPageHeadingSelector = '[data-cy="your-appeal-details-page-heading"]';

const aboutTheOriginalPlanningApplicationSelector =
  '[data-cy="about-the-original-planning-application"]';
const aboutYourAppealSelector = '[data-cy="about-your-appeal"]';
const visitingTheAppealSiteSelector = '[data-cy="visiting-the-appeal-site"]';

const allAccordionSections = [
  aboutYourAppealSelector,
  aboutTheOriginalPlanningApplicationSelector,
  visitingTheAppealSiteSelector,
];

const accordionOpenCloseAllToggleButton =
  '#accordion-your-appeal-details > div.govuk-accordion__controls > button';

const getSelectorByString = (string) => {
  switch (string) {
    case 'About the original planning application':
      return aboutTheOriginalPlanningApplicationSelector;
    case 'About your appeal':
      return aboutYourAppealSelector;
    case 'Visiting the appeal site':
      return visitingTheAppealSiteSelector;
    default:
      throw new Error(`${string} was not configured.`);
  }
};

module.exports = {
  aboutTheOriginalPlanningApplicationSelector,
  aboutYourAppealSelector,
  accordionOpenCloseAllToggleButton,
  allAccordionSections,
  getSelectorByString,
  yourAppealDetailsPageHeadingSelector,
  visitingTheAppealSiteSelector,
};
