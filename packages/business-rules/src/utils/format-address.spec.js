const formatAddress = require('./format-address');

describe('utils/format-address', () => {
  it('should return the correct address when given all fields', () => {
    const formattedAddress = formatAddress({
      addressLine1: 'Address 1',
      addressLine2: 'Address 2',
      town: 'Town',
      county: 'County',
      postcode: 'Postcode',
    });
    expect(formattedAddress).toEqual('Address 1\nAddress 2\nTown\nCounty\nPostcode');
  });

  it('should return the correct address when given the required fields', () => {
    const formattedAddress = formatAddress({
      addressLine1: 'Address 1',
      addressLine2: '',
      town: '',
      county: '',
      postcode: 'Postcode',
    });
    expect(formattedAddress).toEqual('Address 1\nPostcode');
  });

  it('should return the correct address when given fields in a dfferent order', () => {
    const formattedAddress = formatAddress({
      postcode: 'Postcode',
      county: 'County',
      town: 'Town',
      addressLine2: 'Address 2',
      addressLine1: 'Address 1',
    });
    expect(formattedAddress).toEqual('Address 1\nAddress 2\nTown\nCounty\nPostcode');
  });
});
