/**
 * @jest-environment jsdom
 */
const { format } = require('date-fns');
const { VIEW } = require('../../../../src/lib/views');
const { appealFromAppellant, appealFromAgent } = require('../../../fixtures/appeal');
const { lpd } = require('../../../fixtures/lpd');
const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/your-planning-appeal/index', () => {
  describe('when an appeal is entered by appellant', () => {
    it('should render the page as expected with appellant details', () => {
      document.body.innerHTML = nunjucksTestRenderer.render(
        `${VIEW.YOUR_PLANNING_APPEAL.INDEX}.njk`,
        {
          appeal: appealFromAppellant,
          lpd,
        }
      );

      expect(document.querySelector('[data-cy="appellant-name"]').textContent).toEqual(
        appealFromAppellant.aboutYouSection.yourDetails.name
      );

      expect(document.querySelector('[data-cy="appellant-address"]').textContent).toEqual(
        appealFromAppellant.appealSiteSection.siteAddress.addressLine1 +
          appealFromAppellant.appealSiteSection.siteAddress.addressLine2 +
          appealFromAppellant.appealSiteSection.siteAddress.town +
          appealFromAppellant.appealSiteSection.siteAddress.county +
          appealFromAppellant.appealSiteSection.siteAddress.postcode
      );
      expect(document.querySelector('[data-cy="appeal-submission-date"]').textContent).toEqual(
        format(new Date(appealFromAppellant.submissionDate), 'd MMMM Y')
      );
      expect(document.querySelector('[data-cy="lpd-docs-statement"]').textContent).toContain(
        lpd.name
      );
    });
  });

  describe('when an appeal is entered by agent', () => {
    it('should render the page as expected with appellant details', () => {
      document.body.innerHTML = nunjucksTestRenderer.render(
        `${VIEW.YOUR_PLANNING_APPEAL.INDEX}.njk`,
        {
          appeal: appealFromAgent,
          lpd,
        }
      );

      expect(document.querySelector('[data-cy="appellant-name"]').textContent).toEqual(
        appealFromAgent.aboutYouSection.yourDetails.appealingOnBehalfOf
      );

      expect(document.querySelector('[data-cy="appellant-address"]').textContent).toEqual(
        appealFromAppellant.appealSiteSection.siteAddress.addressLine1 +
          appealFromAppellant.appealSiteSection.siteAddress.addressLine2 +
          appealFromAppellant.appealSiteSection.siteAddress.town +
          appealFromAppellant.appealSiteSection.siteAddress.county +
          appealFromAppellant.appealSiteSection.siteAddress.postcode
      );
      expect(document.querySelector('[data-cy="appeal-submission-date"]').textContent).toEqual(
        format(new Date(appealFromAppellant.submissionDate), 'd MMMM Y')
      );
      expect(document.querySelector('[data-cy="lpd-docs-statement"]').textContent).toContain(
        lpd.name
      );
    });
  });
});
