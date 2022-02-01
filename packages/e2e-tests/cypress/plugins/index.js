///<reference types="cypress">
const cucumber = require('cypress-cucumber-preprocessor').default;
const { downloadFile } = require('cypress-downloadfile/lib/addPlugin');
const pdf = require('pdf-parse');
const htmlvalidate = require('cypress-html-validate/dist/plugin');
const  MongoClient  = require('mongodb').MongoClient;
fs = require('fs');

/**
 * @type {function(*): {metadata: null, text: string, numpages: number, version: null, numrender: number, info: null}}
 */
const parsePdf = async (pdfBuffer) => {
  return await pdf(pdfBuffer);
};

module.exports = (on,config) => {
  const queue = require('./queue')(config);
  on('file:preprocessor', cucumber());
  on('task', {
    log(message) {
      console.log(message)
      return null
    },
    async getPdfContent(pdfBuffer) {
      const parsed = parsePdf(pdfBuffer);
      return parsed.text;
    },
      downloadFile,
  });
  on('task',  {
    listenToQueue: queue.listenToQueue,
      putOnQueue: queue.putOnQueue,
    getLastFromQueue: queue.getLastFromQueue,
  });
  on('task',{
    getData({collection,filter}){
      return new Promise((resolve) => {
        MongoClient.connect('mongodb://localhost:4000/', (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            const db = client.db('appeals-service-api');
            console.log("Collection --- " + collection + "   --- filter --- " + JSON.stringify(filter));
            let i = 0;
            try {
              fs.unlinkSync('cypress/fixtures/responses.json');
            }
            catch (err) {
              console.log("Error while deleting the responses.json file." + err);
            }
            db.collection(collection).find({ key:filter }).toArray(function (error, docs) {
              if (error) {
                console.log("Error while fetching documents from collection.");
                return;
              }
              console.log(docs);

              docs = docs.reduce((docs, e) => ({ ...docs, [e.key]: e }), {});
              fs.appendFile('cypress/fixtures/responses.json', JSON.stringify(docs), 'utf8',
                function (err) {
                  if (err) throw err;
                  console.log("Data is appended to file successfully.")
                  resolve('');
                  client.close();

                });

            })
          }

        })
      });
    }
  })
  htmlvalidate.install(on, null, {
    exclude: ["title", "link","script",".govuk-header",".govuk-footer", "h1", "h2"],
    include: [],
  });
}
