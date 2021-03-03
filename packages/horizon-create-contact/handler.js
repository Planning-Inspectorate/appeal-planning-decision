const axios = require('axios');

module.exports = async (event, context) => {
  const config = {
    horizon: {
      url: process.env.HORIZON_URL,
    },
  };

  console.log(JSON.stringify(config));

  const { body } = event;

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

  console.log('Adding contact in Horizon', JSON.stringify(input));

  try {
    const { data } = await axios.post(`${config.horizon.url}/contacts`, input);

    console.log('Contact added to Horizon', JSON.stringify(data));

    return {
      id: data?.Envelope?.Body?.AddContactResponse?.AddContactResult?.value,
    };
  } catch (err) {
    let message;
    let httpStatus = 500;
    if (err.response) {
      message = 'No response received from Horizon';
      console.log(
        message,
        JSON.stringify({
          message: err.message,
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers,
        })
      );
    } else if (err.request) {
      message = 'Error sending to Horizon';
      httpStatus = 400;
      console.log(
        message,
        JSON.stringify({
          message: err.message,
          request: err.request,
        })
      );
    } else {
      message = 'General error';
      console.log(
        message,
        JSON.stringify({
          message: err?.message,
          stack: err?.stack,
        })
      );
    }

    context.httpStatus = httpStatus;

    return {
      message,
    };
  }
};
