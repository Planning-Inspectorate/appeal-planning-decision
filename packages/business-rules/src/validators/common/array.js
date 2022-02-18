const buildAllOfMessage = (allOfArray) => (context) =>
  `You must have ${JSON.stringify(allOfArray)} for ${context.path} but you have ${JSON.stringify(
    context.value,
  )}`;

function allOf(allOfArray) {
  return this.test('allOf', buildAllOfMessage(allOfArray), (value) => {
    if (Array.isArray(value)) {
      return allOfArray.every((item) => value.includes(item));
    }
    return true;
  });
}

module.exports = {
  allOf,
};
