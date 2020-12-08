module.exports = (appeal) => {
  if (!appeal) {
    return [];
  }

  const address = [
    appeal['site-address-line-one'],
    appeal['site-address-line-two'],
    appeal['site-town-city'],
    appeal['site-county'],
    appeal['site-postcode'],
  ];

  return address.filter((n) => n);
};
