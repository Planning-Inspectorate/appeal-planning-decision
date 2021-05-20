const {
  subdomainArrayToString,
  extractRootDomainNameFromHostnameAndSubdomains,
} = require('../../src/lib/extract-root-domain-name-from-full-domain-name');

describe('lib/extract-root-domain-name-from-full-domain-name', () => {
  describe('subdomainArrayToString', () => {
    [
      {
        given: [''],
        expected: '',
      },
      {
        given: ['a'],
        expected: 'a',
      },
      {
        given: ['b', 'a'],
        expected: 'a.b',
      },
      {
        given: ['c', 'b', 'a'],
        expected: 'a.b.c',
      },
    ].forEach(({ given, expected }) => {
      it(`should return the expected subdomain path - ${expected}`, () => {
        expect(subdomainArrayToString(given)).toEqual(expected);
      });
    });
  });

  describe('extractRootDomainNameFromHostnameAndSubdomains', () => {
    [
      {
        given: {
          hostname: '',
          subdomains: [],
        },
        expected: '',
      },
      {
        given: {
          hostname: 'example.com',
          subdomains: [],
        },
        expected: 'example.com',
      },
      {
        given: {
          hostname: 'www.example.com',
          subdomains: ['www'],
        },
        expected: 'example.com',
      },
      {
        given: {
          hostname: 'appeals-dev.planninginspectorate.gov.uk',
          subdomains: ['appeals-dev'],
        },
        expected: 'planninginspectorate.gov.uk',
      },
      {
        given: {
          hostname: 'nested.appeals-dev.planninginspectorate.gov.uk',
          subdomains: ['appeals-dev', 'nested'],
        },
        expected: 'planninginspectorate.gov.uk',
      },
    ].forEach(({ given: { hostname, subdomains }, expected }) => {
      it(`should return the expected root domain - ${hostname}`, () => {
        expect(extractRootDomainNameFromHostnameAndSubdomains(hostname, subdomains)).toEqual(
          expected
        );
      });
    });
  });
});
