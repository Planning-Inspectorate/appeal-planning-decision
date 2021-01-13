const formatAppealSiteAddress = require('../../../src/lib/appeal-site-address-to-array');

describe('lib/appeal-site-address-to-array', () => {
  [
    {
      title: 'full address',
      given: {
        appealSiteSection: {
          siteAddress: {
            addressLine1: '1 Taylor Road',
            addressLine2: 'Clifton',
            town: 'Bristol',
            county: 'South Glos',
            postcode: 'BS8 1TG',
          },
        },
      },
      expected: ['1 Taylor Road', 'Clifton', 'Bristol', 'South Glos', 'BS8 1TG'],
    },
    {
      title: 'minimum viable address',
      given: {
        appealSiteSection: {
          siteAddress: {
            addressLine1: '1 Taylor Road',
            county: 'South Glos',
            postcode: 'BS8 1TG',
          },
        },
      },
      expected: ['1 Taylor Road', 'South Glos', 'BS8 1TG'],
    },
    {
      title: 'address line 2 is missing',
      given: {
        appealSiteSection: {
          siteAddress: {
            addressLine1: '1 Taylor Road',
            town: 'Bristol',
            county: 'South Glos',
            postcode: 'BS8 1TG',
          },
        },
      },
      expected: ['1 Taylor Road', 'Bristol', 'South Glos', 'BS8 1TG'],
    },
    {
      title: 'town / city is missing is missing',
      given: {
        appealSiteSection: {
          siteAddress: {
            addressLine1: '1 Taylor Road',
            addressLine2: 'Clifton',
            county: 'South Glos',
            postcode: 'BS8 1TG',
          },
        },
      },
      expected: ['1 Taylor Road', 'Clifton', 'South Glos', 'BS8 1TG'],
    },
    {
      title: 'undefined returns empty array',
      given: undefined,
      expected: [],
    },
    {
      title: 'empty object returns empty array',
      given: {},
      expected: [],
    },
    {
      title: 'unset appeal.appealSiteSection returns empty array',
      given: {
        a: 'b',
      },
      expected: [],
    },
    {
      title: 'unset appeal.appealSiteSection.siteAddress returns empty array',
      given: {
        appealSiteSection: 'b',
      },
      expected: [],
    },
  ].forEach(({ title, given, expected }) => {
    it(`should format the address as expected - ${title}`, () => {
      expect(formatAppealSiteAddress(given)).toEqual(expected);
    });
  });
});
