module.exports = (event) => {
  const response = {
    status: `Received input: ${JSON.stringify(event.body)}`,
  };

  return response;
};
