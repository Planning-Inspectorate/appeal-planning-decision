const errorMessage = (req) => {
  const { ownsSomeOfTheLand } = req.session.appeal.appealSiteSection.siteOwnership;
  if (ownsSomeOfTheLand) {
    return 'Select if you know who owns the rest of the land involved in the appeal';
  }
  return 'Select if you know who owns the land involved in the appeal';
};

module.exports = errorMessage;
