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
  // build the request
  const form = new FormData();
  // -note... because we give this url to gotenberg, we have to give it the url that it can see
  //         that means we have to use the hostname+port it can see from inside docker-compose-land
  //         not the url we use from outside (ie. localhost:9000)
  form.append('remoteURL', `http://forms-web-app:3000/pdf/source/${req.params.id}`);

  // make the call
  const response = await axios.post('http://gotenberg:4000/convert/url', form, {
    headers: form.getHeaders(),
    responseType: 'stream',
  });

  response.data.pipe(res);
});
module.exports = router;
