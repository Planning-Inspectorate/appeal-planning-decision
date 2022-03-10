const axios = require('axios');

module.exports = async (log, body) => {
  const config = {
    horizon: {
      url: process.env.HORIZON_URL,
    },
  };

  log('Receiving create contact request');

  let contactData;

  if (body?.organisationId == null) {
    contactData = [
      {
        key: 'a:Email',
        value: body?.email,
      },
      {
        key: 'a:FirstName',
        value: body?.firstName || '<Not provided>',
      },
      {
        key: 'a:LastName',
        value: body?.lastName || '<Not provided>',
      },
    ];
  } else {
    contactData = [
      {
        key: 'a:Email',
        value: body?.email,
      },
      {
        key: 'a:FirstName',
        value: body?.firstName || '<Not provided>',
      },
      {
        key: 'a:LastName',
        value: body?.lastName || '<Not provided>',
      },
      {
        key: 'a:OrganisationID',
        value: body?.organisationId?.id,
      },
    ];
  }

  log('Contact Data');
  log(contactData);

  /* The order of this appears to be important - first and last name's are required by Horizon */
  // const contactData = [
  //   {
  //     key: 'a:Email',
  //     value: body?.email,
  //   },
  //   {
  //     key: 'a:FirstName',
  //     value: body?.firstName || '<Not provided>',
  //   },
  //   {
  //     key: 'a:LastName',
  //     value: body?.lastName || '<Not provided>',
  //   },
  // ];

  const input = {
    AddContact: {
      __soap_op: 'http://tempuri.org/IContacts/AddContact',
      __xmlns: 'http://tempuri.org/',
      contact: contactData.reduce(
        (result, { key, value }) => ({
          ...result,
          [key]: value ?? {
            '__i:nil': 'true',
          },
        }),
        {
          '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Contacts.API',
          '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
          '__i:type': 'a:HorizonAPIPerson',
        }
      ),
    },
  };

  log('Adding contact in Horizon');

  try {
    const { data } = await axios.post(`${config.horizon.url}/contacts`, input);

    log('Contact added to Horizon');

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
