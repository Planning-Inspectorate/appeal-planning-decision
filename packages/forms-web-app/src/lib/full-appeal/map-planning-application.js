module.exports = (application) => {
  switch (application) {
    case 'full-appeal':
      return '1005';

    case 'householder':
      return '1001';

    default:
      return '1001';
  }
};
