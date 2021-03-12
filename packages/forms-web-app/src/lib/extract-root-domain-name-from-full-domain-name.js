const subdomainArrayToString = (subdomains) => subdomains.reverse().join('.');

/**
 * The expected shape of both of these arguments is as per the express req object.
 *
 * @param hostname
 * @param subdomains
 * @returns {*}
 */
const extractRootDomainNameFromHostnameAndSubdomains = (hostname, subdomains) => {
  const subdomain = subdomains.length > 0 ? `${subdomainArrayToString(subdomains)}.` : '';
  return hostname.replace(subdomain, '');
};

module.exports = {
  extractRootDomainNameFromHostnameAndSubdomains,
  subdomainArrayToString,
};
