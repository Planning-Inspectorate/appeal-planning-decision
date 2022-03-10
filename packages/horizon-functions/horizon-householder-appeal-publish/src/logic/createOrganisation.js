const axios = require('axios');

module.exports = async (log, body) => {
  const config = {
    horizon: {
      url: process.env.HORIZON_URL,
    },
  };

  log('Receiving create organisation request');

  /* The order of this appears to be important - first and last name's are required by Horizon */
  const organisationData = [
    {
      key: 'a:Name',
      value: body,
    },
  ];

  const input = {
    AddContact: {
      __soap_op: 'http://tempuri.org/IContacts/AddContact',
      __xmlns: 'http://tempuri.org/',
      contact: organisationData.reduce(
        (result, { key, value }) => ({
          ...result,
          [key]: value ?? {
            '__i:nil': 'true',
          },
        }),
        {
          '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Contacts.API',
          '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
          '__i:type': 'a:HorizonAPIOrganisation',
        }
      ),
    },
  };

  log('Adding organisation in Horizon');

  try {
    const { data } = await axios.post(`${config.horizon.url}/contacts`, input);

    log('Organisation added to Horizon');

    return {
      id: data?.Envelope?.Body?.AddContactResponse?.AddContactResult?.value,
    };
  } catch (err) {
    let message;
    if (err.response) {
      message = 'No response received from Horizon';
      log(message);
    } else if (err.request) {
      message = 'Error sending to Horizon';
      log(message);
    } else {
      message = 'General error';
      log(message);
    }

    return {
      message,
    };
  }
};
