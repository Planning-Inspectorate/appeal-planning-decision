const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const FormData = require('form-data');
const fs = require('fs');


describe('pdf', ()=> {
  test('generated from a file', async () => {
    const myfile = 'html.pdf';

    // clean up any old files
    if (fs.existsSync(myfile)) {
      fs.unlinkSync(myfile);
    }

    // build the request
    const form = new FormData();
    form.append('files', fs.createReadStream('./index.html'));

    // make the call
    const response = await axios.post('http://localhost:3500/convert/html', form, {
      headers: form.getHeaders(),
      responseType: 'stream',
    })
    expect(response.status).toBe(200);

    // dump to a file
    const writer = fs.createWriteStream(myfile);
    response.data.pipe(writer);

    // at least check the file showed up..
    writer.on('end', () => {
      expect(fs.existsSync(myfile)).toBe(true);
    })

  });

  test('generated from a url', async () => {
    const myfile = 'url.pdf';

    // clean up any old files
    if (fs.existsSync(myfile)) {
      fs.unlinkSync(myfile);
    }

    // build the request
    const form = new FormData();
      //-note... because we give this url to gotenberg, we have to give it the url that it can see
      //         that means we have to use the hostname+port it can see from inside docker-compose-land
      //         not the url we use from outside (ie. localhost:9000)
    form.append('remoteURL', 'http://forms-web-app:3000/eligibility/decision-date');

    // make the call
    const response = await axios.post('http://localhost:3500/convert/url', form, {
      headers: form.getHeaders(),
      responseType: 'stream',
    })
    expect(response.status).toBe(200);

    // dump to a file
    const writer = fs.createWriteStream(myfile);
    response.data.pipe(writer);

    // at least check the file showed up..
    writer.on('end', () => {
      expect(fs.existsSync(myfile)).toBe(true);
    })

  });

});
