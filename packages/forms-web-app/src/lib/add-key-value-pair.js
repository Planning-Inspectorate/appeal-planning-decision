module.exports = (dict, key, value) => {
  if (!key) {
    return dict;
  }

  return {
    ...dict,
    [key]: value,
  };
};
