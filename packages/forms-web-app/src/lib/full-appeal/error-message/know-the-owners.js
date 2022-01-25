const errorMessage = (req) => {
  const { appealSiteSection: { ownsSomeOfTheLand } = {} } = req.session.appeal;
  if (ownsSomeOfTheLand) {
    return 'Select if you know who owns the rest of the land involved in the appeal';
  }
  return 'Select if you know who owns the land involved in the appeal';
};

module.exports = errorMessage;
