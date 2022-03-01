const formatAddress = ({ addressLine1, addressLine2, town, county, postcode }) => {
  let address = addressLine1;
  address += addressLine2 && `\n${addressLine2}`;
  address += town && `\n${town}`;
  address += county && `\n${county}`;
  address += `\n${postcode}`;
  return address;
};

module.exports = formatAddress;
