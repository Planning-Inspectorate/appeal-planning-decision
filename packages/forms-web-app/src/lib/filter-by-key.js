module.exports = (dict, key) =>
  Object.keys(dict)
    .filter((k) => k !== key)
    .reduce((obj, k) => {
      // eslint-disable-next-line no-param-reassign
      obj[k] = dict[k];
      return obj;
    }, {});
