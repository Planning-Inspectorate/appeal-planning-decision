const { appealsApi } = require('../lib/appeals-api-wrapper');

const VIEW = {
  YOUR_DETAILS: 'your-details/index',
};

exports.getYourDetails = (req, res) => {
  res.render(VIEW.YOUR_DETAILS, {
    appeal: req.session.appeal,
  });
};

exports.postYourDetails = async (req, res) => {
  const body = {
    appellantName: req.body['appellant-name'],
    appellantEmail: req.body['appellant-email'],
  };

  try {
    const uuid = (req.session && req.session.uuid) || '';
    const appealJson = await appealsApi(body, uuid);

    req.session.uuid = uuid;
    req.session.appeal = appealJson;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  res.redirect('/application-number');
};
