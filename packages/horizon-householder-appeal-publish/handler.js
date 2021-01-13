const axios = require('axios');
const { _ } = require('lodash');

const config = {
  appealsService: {
    url: process.env.APPEALS_SERVICE_URL,
  },
  horizon: {
    url: process.env.HORIZON_URL,
  },
};

console.log({
  config,
});

function convertToSoapKVPair(key, value) {
  if (Array.isArray(value)) {
    return {
      '__i:type': 'a:SetAttributeValue',
      'a:Name': key,
      'a:Values': value.map((item) => convertToSoapKVPair(item.key, item.value)),
    };
  }

  const date = Date.parse(value);

  if (!Number.isNaN(date)) {
    /* Value is a date */
    return {
      '__i:type': 'a:DateAttributeValue',
      'a:Name': key,
      'a:Value': date.toISOString(),
    };
  }

  /* Everything else is a string */
  return {
    '__i:type': 'a:DateAttributeValue',
    'a:Name': key,
    'a:Value': value,
  };
}

/**
 * Get LPA Data
 *
 * Returns the LPA data
 *
 * @param code
 * @returns {Promise<{ id: string, name: string, inTrial: boolean, england: boolean, wales: boolean, horizonId: string }>}
 */
async function getLpaData(code) {
  const { data } = await axios.get(`/api/v1/local-planning-authorities/${code}`, {
    baseURL: config.appealsService.url,
  });

  return data;
}

module.exports = async (event, context) => {
  try {
    const { body } = event;

    /* Get the LPA associated with this appeal */
    const lpa = await getLpaData(body.appeal.lpaCode);
    let location;
    if (lpa.england) {
      location = 'England';
    } else if (lpa.wales) {
      location = 'Wales';
    }

    const data = {
      CreateCase: {
        __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
        __xmlns: 'http://tempuri.org/',
        caseType: 'Householder (HAS) Appeal',
        dateOfReceipt: null,
        LPACode: lpa.horizonId,
        location,
        category: {
          '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
          '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
          'a:Attributes': [
            {
              key: 'Case:Case Publish Flag',
              value: 'No',
            },
            {
              key: 'Case Site:Site Address Line 1',
              value: _.get(body, 'appeal.appealSiteSection.siteAddress.addressLine1'),
            },
          ].map(({ key, value }) => convertToSoapKVPair(key, value)),
        },
        documents: [],
      },
    };

    console.log('Calling Horizon');

    await axios.post(config.horizon.url, data);

    console.log('Successful call to Horizon');
    return context.status(200).succeed({ data });
  } catch (err) {
    console.error('Error sending to Horizon', err);
    return context.status(400).fail(err);
  }
};
