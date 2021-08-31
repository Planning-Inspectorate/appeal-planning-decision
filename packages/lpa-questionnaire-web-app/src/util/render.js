const renderView = (res, view, params) => {
  const { prefix, backLink, ...payload } = params;

  if (typeof backLink !== 'undefined' && !backLink.includes(prefix)) {
    return res.render(view, {
      backLink: `/${prefix}${backLink}`,
      ...payload,
    });
  }

  return res.render(view, { backLink, ...payload });
};

const redirect = (res, prefix, url, backlink) => {
  if (typeof backlink !== 'undefined' && !backlink.includes(prefix)) {
    return res.redirect(`/${prefix}${backlink}`);
  }
  return res.redirect(`/${prefix}/${url}`);
};

module.exports = {
  renderView,
  redirect,
};
