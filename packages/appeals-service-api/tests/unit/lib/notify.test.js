const {
  getAddress,
  getNotifyClientArguments,
  getFileUrl,
  getOptions,
} = require('../../../src/lib/notify');

describe('Getting formatted address', () => {
  test('Format address from all fields', () => {
    const input = {
      addressLine1: 'Line 1',
      addressLine2: 'Line 2',
      town: 'Town',
      county: 'County',
      postcode: 'SA18 3RT',
    };
    const output = 'Line 1\nLine 2\nTown\nCounty\nSA18 3RT';
    expect(getAddress(input)).toEqual(output);
  });

  test('Format address with minimum fields', () => {
    const input = {
      addressLine1: 'Line 1',
      county: 'County',
      postcode: 'SA18 3RT',
    };
    const output = 'Line 1\nCounty\nSA18 3RT';
    expect(getAddress(input)).toEqual(output);
  });

  test('Using mock service', () => {
    const baseUrl = 'http://mock-notify:3000';
    const serviceId = 'dummy-service-id-for-notify';
    const apiKey = 'dummy-api-key-for-notify';
    const output = [
      'http://mock-notify:3000',
      'dummy-service-id-for-notify',
      'dummy-api-key-for-notify',
    ];
    expect(getNotifyClientArguments(baseUrl, serviceId, apiKey)).toEqual(output);
  });

  test('Using real service', () => {
    const baseUrl = null;
    const serviceId = 'dummy-service-id-for-notify';
    const apiKey = 'dummy-api-key-for-notify';
    const output = ['dummy-api-key-for-notify'];
    expect(getNotifyClientArguments(baseUrl, serviceId, apiKey)).toEqual(output);
  });

  test('Calculate file url', () => {
    const docSrvUrl = 'http:/docs-srv:3000';
    const applicationId = 'fdre-355g-jd7798';
    const documentId = 'jh345-kjesw-23c-kdfgu';
    const output = 'http:/docs-srv:3000/api/v1/fdre-355g-jd7798/jh345-kjesw-23c-kdfgu/file';
    expect(getFileUrl(docSrvUrl, applicationId, documentId)).toEqual(output);
  });

  test('Calculate options', () => {
    const address = 'Line 1\nLine 2\nTown\nCounty\nSA18 3RT';
    const link = {
      file: 'JVBERi0MxNTIxUXXhTu/X5Nzc0CiUlRU9G',
      is_csv: false,
    };
    const lpa = 'Bradford LPA';
    const name = 'John Smith';
    const appealId = 'jhbdfoi-d72344675348-q3iuhak7u5324jvb§00mdf-jdaijhbwefi';
    const output = {
      personalisation: {
        'appeal site address': address,
        'link to appeal submission pdf': link,
        'local planning department': lpa,
        name,
      },
      reference: appealId,
    };
    expect(getOptions(address, link, lpa, name, appealId)).toEqual(output);
  });
});
