function isEmailWithinDomain(email, domainName) {
  const emailDomainName = email.split('@')[1];
  return emailDomainName === domainName;
}

module.exports = { isEmailWithinDomain };
