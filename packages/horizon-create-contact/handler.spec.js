jest.mock('axios');

const axios = require('axios');
const handler = require('./handler');

describe('handler', () => {
  const envvars = process.env;
  let context;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...envvars };

    context = {
      httpStatus: 200,
    };
  });

  afterEach(() => {
    process.env = envvars;
  });

  it('should simulate a successful call with no optional data', async () => {
    process.env.HORIZON_URL = 'some-horizon-url';

    const body = {
      firstName: 'Test',
      lastName: 'Testington',
    };

    const horizonId = 'abc123';

    axios.post.mockResolvedValue({
      data: {
        Envelope: {
          Body: {
            AddContactResponse: {
              AddContactResult: {
                value: horizonId,
              },
            },
          },
        },
      },
    });

    expect(await handler({ body }, context)).toEqual({
      id: horizonId,
    });

    expect(axios.post).toBeCalledWith(`${process.env.HORIZON_URL}/contacts`, {
      AddContact: {
        __soap_op: 'http://tempuri.org/IContacts/AddContact',
        __xmlns: 'http://tempuri.org/',
        contact: {
          '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Contacts.API',
          '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
          '__i:type': 'a:HorizonAPIPerson',
          'a:FirstName': body.firstName,
          'a:LastName': body.lastName,
          'a:Email': {
            '__i:nil': 'true',
          },
        },
      },
    });

    expect(context).toEqual({
      httpStatus: 200,
    });
  });

  it('should simulate a successful call with optional data', async () => {
    process.env.HORIZON_URL = 'some-horizon-url2';

    const body = {
      firstName: 'Test2',
      lastName: 'Testington2',
      email: 'some@email.com',
    };

    const horizonId = 'abc124';

    axios.post.mockResolvedValue({
      data: {
        Envelope: {
          Body: {
            AddContactResponse: {
              AddContactResult: {
                value: horizonId,
              },
            },
          },
        },
      },
    });

    expect(await handler({ body }, context)).toEqual({
      id: horizonId,
    });

    expect(axios.post).toBeCalledWith(`${process.env.HORIZON_URL}/contacts`, {
      AddContact: {
        __soap_op: 'http://tempuri.org/IContacts/AddContact',
        __xmlns: 'http://tempuri.org/',
        contact: {
          '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Contacts.API',
          '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
          '__i:type': 'a:HorizonAPIPerson',
          'a:FirstName': body.firstName,
          'a:LastName': body.lastName,
          'a:Email': body.email,
        },
      },
    });

    expect(context).toEqual({
      httpStatus: 200,
    });
  });

  it('should simulate a failed response from Horizon', async () => {
    process.env.HORIZON_URL = 'some-horizon-url2';

    const body = {
      firstName: 'Test2',
      lastName: 'Testington2',
      email: 'some@email.com',
    };

    const message = 'some-message';
    const response = {
      data: 'some-data',
      status: 'some-status',
      headers: 'some-headers',
    };

    axios.post.mockRejectedValue({
      message,
      response,
    });

    expect(await handler({ body }, context)).toEqual({
      message: 'No response received from Horizon',
    });

    expect(context).toEqual({
      httpStatus: 500,
    });
  });

  it('should simulate a failed call to Horizon', async () => {
    process.env.HORIZON_URL = 'some-horizon-url2';

    const body = {
      firstName: 'Test2',
      lastName: 'Testington2',
      email: 'some@email.com',
    };

    const message = 'some-message2';
    const request = 'some-request';

    axios.post.mockRejectedValue({
      message,
      request,
    });

    expect(await handler({ body }, context)).toEqual({
      message: 'Error sending to Horizon',
    });

    expect(context).toEqual({
      httpStatus: 400,
    });
  });

  it('should simulate a general exception', async () => {
    process.env.HORIZON_URL = 'some-horizon-url2';

    const body = {
      firstName: 'Test2',
      lastName: 'Testington2',
      email: 'some@email.com',
    };

    const message = 'some-exception';

    axios.post.mockRejectedValue({
      message,
    });

    expect(await handler({ body }, context)).toEqual({
      message: 'General error',
    });

    expect(context).toEqual({
      httpStatus: 500,
    });
  });
});
