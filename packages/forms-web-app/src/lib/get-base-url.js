module.exports = (req) => {
  if (!req.protocol || !req.get('host')) {
    return undefined;
  }

  return `${req.protocol}://${req.get('host')}`;
};
