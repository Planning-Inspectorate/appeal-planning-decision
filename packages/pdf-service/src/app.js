let express = require('express');
let cors = require('cors');
const puppeteer = require('puppeteer');
var bodyParser = require('body-parser');

let app = express();

const jsonParser = bodyParser.json();

app.use(
  cors({
    origin: '*',
    methods: 'GET,POST',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.get('/test', async (req, res) => {
  res.status(200).json({
    message: 'success',
  });
});

app.post('/generate', jsonParser, async (req, res) => {
  console.dir(req.body.html);

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
    });
  } catch (error) {
    console.log('error opening Chromium browser', error);
  }

  // const page = await browser.newPage();

  // await page.setContent(req.body, {
  //   waitUntil: 'domcontentloaded',
  // });

  // // create a pdf buffer
  // // const pdfBuffer = await page.pdf({
  // //   format: 'A4',
  // // });

  // // or a .pdf file
  // const pdf = await page.pdf({
  //   format: 'A4',
  //   path: `${__dirname}/my-fance-invoice.pdf`,
  // });

  // res.contentType('application/pdf');

  await browser.close();

  // res.send(pdf);

  res.status(200).json({
    message: 'temp',
  });
});

app.listen(3000, () => {
  console.log('pdf-service started');
});

module.exports = app;
