const axios = require('axios');
const FormData = require('form-data');
const express = require('express');
const { getExistingAppeal } = require('../../lib/appeals-api-wrapper');
const { getDepartmentFromId } = require('../../services/department.service');
const { VIEW } = require('../../lib/views');

const router = express.Router();

router.get('/source/:id', async (req, res) => {
  const appeal = await getExistingAppeal(req.params.id);

  let appealLPD = '';

  if (appeal.lpaCode) {
    const lpd = await getDepartmentFromId(appeal.lpaCode);
    if (lpd) {
      appealLPD = lpd.name;
    }
  }

  res.render(VIEW.PDF.SOURCE, {
    appealLPD,
    appeal,
  });
});

router.get('/download/:id', async (req, res) => {
  const form = new FormData();
  form.append('remoteURL', `http://forms-web-app:3000/pdf/source/${req.params.id}`);

  const response = await axios.post('http://gotenberg:4000/convert/url', form, {
    headers: form.getHeaders(),
    responseType: 'stream',
  });

  response.data.pipe(res);
});
module.exports = router;
