const api = require('../apis/appealsApi');

exports.getAppeal = async (appealId) => {
  const appeal = await api.get({
    url: `/api/v1/appeals/${appealId}`,
    route: '/appeals/:appealId',
  });

  return appeal;
};
