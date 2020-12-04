const formatAppealSiteAddress = require('../../../src/lib/appeal-site-address-to-array');

describe('lib/appeal-site-address-to-array', () => {
  [
    {
      title: 'full address',
      given: {
        'site-address-line-one': '1 Taylor Road',
        'site-address-line-two': 'Clifton',
        'site-town-city': 'Bristol',
        'site-county': 'South Glos',
        'site-postcode': 'BS8 1TG',
      },
      expected: ['1 Taylor Road', 'Clifton', 'Bristol', 'South Glos', 'BS8 1TG'],
    },
    {
      title: 'minimum viable address',
      given: {
        'site-address-line-one': '1 Taylor Road',
        'site-county': 'South Glos',
        'site-postcode': 'BS8 1TG',
      },
      expected: ['1 Taylor Road', 'South Glos', 'BS8 1TG'],
    },
    {
      title: 'address line 2 is missing',
      given: {
        'site-address-line-one': '1 Taylor Road',
        'site-town-city': 'Bristol',
        'site-county': 'South Glos',
        'site-postcode': 'BS8 1TG',
      },
      expected: ['1 Taylor Road', 'Bristol', 'South Glos', 'BS8 1TG'],
    },
    {
      title: 'town / city is missing is missing',
      given: {
        'site-address-line-one': '1 Taylor Road',
        'site-address-line-two': 'Clifton',
        'site-county': 'South Glos',
        'site-postcode': 'BS8 1TG',
      },
      expected: ['1 Taylor Road', 'Clifton', 'South Glos', 'BS8 1TG'],
    },
  ].forEach(({ title, given, expected }) => {
    it(`should format the address as expected - ${title}`, () => {
      expect(formatAppealSiteAddress(given)).toEqual(expected);
    });
  });
});
