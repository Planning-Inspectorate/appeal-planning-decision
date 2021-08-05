const renderView = (res, view, { prefix, backLink, ...params }) => {
  if (typeof backLink !== 'undefined' && !backLink.includes(prefix)) {
    return res.render(view, {
      backLink: `/${prefix}${backLink}`,
      ...params,
    });
  }

  return res.render(view, { backLink, ...params });
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
