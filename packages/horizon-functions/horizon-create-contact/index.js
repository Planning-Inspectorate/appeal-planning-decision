const axios = require('axios');

module.exports = async (context, req) => {
  const config = {
    horizon: {
      url: process.env.HORIZON_URL,
    },
  };

  context.log('Receiving create contact request');

  const { body } = req;

  /* The order of this appears to be important - first and last name's are required by Horizon */
  const contactData = [
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

  context.log('Adding contact in Horizon');

  try {
    const { data } = await axios.post(`${config.horizon.url}/contacts`, input);

    context.log('Contact added to Horizon');

    return {
      id: data?.Envelope?.Body?.AddContactResponse?.AddContactResult?.value,
    };
  } catch (err) {
    let message;
    let httpStatus = 500;
    if (err.response) {
      message = 'No response received from Horizon';
      context.log(message);
    } else if (err.request) {
      message = 'Error sending to Horizon';
      httpStatus = 400;
      context.log(message);
    } else {
      message = 'General error';
      context.log(message);
    }

    context.httpStatus = httpStatus;

    return {
      message,
    };
  }
};
