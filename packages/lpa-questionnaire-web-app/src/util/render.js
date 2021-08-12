const renderView = (res, view, { backLink, ...params }) => {
  if (typeof backLink !== 'undefined') {
    return res.render(view, {
      backLink: `/appeal-questionnaire/${backLink}`,
      ...params,
    });
  }

  return res.render(view, { ...params });
};

module.exports = {
  renderView,
};
