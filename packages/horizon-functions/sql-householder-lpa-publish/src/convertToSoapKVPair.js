const convertToSoapKVPair = (log, key, value) => {
  log(
    {
      key,
      value,
    },
    'Parsing soap key/value pair'
  );

  if (Array.isArray(value)) {
    log('Parsing as array');
    return {
      'a:AttributeValue': {
        '__i:type': 'a:SetAttributeValue',
        'a:Name': key,
        'a:Values': value.map((item) => convertToSoapKVPair(log, item.key, item.value)),
      },
    };
  }

  if (value == null) {
    log('Parsing as null');
    return {
      'a:AttributeValue': {
        '__i:type': 'a:StringAttributeValue',
        'a:Name': key,
        'a:Value': null,
      },
    };
  }

  if (value.toISOString) {
    /* Value is a date */
    log('Parsing as date');
    return {
      'a:AttributeValue': {
        '__i:type': 'a:DateAttributeValue',
        'a:Name': key,
        'a:Value': value.toISOString(),
      },
    };
  }

  let cleanValue = value;

  /* Check for booleans - convert to "Yes" or "No" */
  if (cleanValue === true) {
    cleanValue = 'Yes';
  } else if (cleanValue === false) {
    cleanValue = 'No';
  }

  /* Everything else is a string */
  log('Parsing as string');
  return {
    'a:AttributeValue': {
      '__i:type': 'a:StringAttributeValue',
      'a:Name': key,
      'a:Value': `${cleanValue}`, // Ensure value a string
    },
  };
};

module.exports = { convertToSoapKVPair };
