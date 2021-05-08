const appealFromAppellant = {
  id: '11111-22222222-333333333333-44444',
  submissionDate: '2021-05-05T15:26:23.970Z',
  aboutYouSection: {
    yourDetails: {
      isOriginalApplicant: true,
      name: 'Valid Name',
      email: 'valid@email.com',
      appealingOnBehalfOf: '',
    },
  },
  appealSiteSection: {
    siteAddress: {
      addressLine1: '1 Taylor Road',
      addressLine2: 'Clifton',
      town: 'Bristol',
      county: 'South Glos',
      postcode: 'BS8 1TG',
    },
  },
};

const appealFromAgent = {
  ...appealFromAppellant,
  ...{
    aboutYouSection: {
      yourDetails: {
        isOriginalApplicant: false,
        name: 'Valid Name',
        email: 'valid@email.com',
        appealingOnBehalfOf: 'Appellant Name',
      },
    },
  },
};

module.exports = { appealFromAppellant, appealFromAgent };
