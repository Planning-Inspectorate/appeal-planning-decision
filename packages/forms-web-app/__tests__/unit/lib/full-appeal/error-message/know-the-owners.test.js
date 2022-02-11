const errorMessage = require('../../../../../src/lib/full-appeal/error-message/know-the-owners');

describe('lib/full-appeal/error-message/know-the-owners', () => {
  let req;

  beforeEach(() => {
    req = {
      session: {
        appeal: {
          appealSiteSection: {
            siteOwnership: {},
          },
        },
      },
    };
  });

  it('should return the correct error message when ownsSomeOfTheLand is true', () => {
    req.session.appeal = {
      appealSiteSection: {
        siteOwnership: {
          ownsSomeOfTheLand: true,
        },
      },
    };

    const result = errorMessage(req);

    expect(result).toEqual(
      'Select if you know who owns the rest of the land involved in the appeal'
    );
  });

  it('should return the correct error message when ownsSomeOfTheLand is false', () => {
    req.session.appeal = {
      appealSiteSection: {
        siteOwnership: {
          ownsSomeOfTheLand: false,
        },
      },
    };

    const result = errorMessage(req);

    expect(result).toEqual('Select if you know who owns the land involved in the appeal');
  });

  it('should return the correct error message when ownsSomeOfTheLand is not set', () => {
    const result = errorMessage(req);

    expect(result).toEqual('Select if you know who owns the land involved in the appeal');
  });
});
