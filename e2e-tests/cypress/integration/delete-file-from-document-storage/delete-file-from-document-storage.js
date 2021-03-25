import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import fs from 'fs';

const { connectToBlobStorage, uploadToBlobStorage } = require('../../../../packages/document-service-api/src/lib/blobStorage');


Given('a request is made to delete a file', async () => {
    const { client } = await connectToBlobStorage()
    const doc = fs.readFileSync('../../fixtures/appeal-good-format.pdf')

    const applicationId = 1234 // TODO: Figure out this one.
    const documentData = {
        file: doc,
        params: { applicationId }
    }

    let [err, res] = cy.request('POST', 'http://localhost:3001/api/v1/${applicationId}', documentData)
                                .then((data) => [null, data])
                                .catch((err)=>[err,null])

    expect(err).toBe(null)

    
    [err, res] = cy.request('DELETE', 'http://localhost:3001/api/v1/${applicationId}/${documentId}')
                                .then((data) => [null, data])
                                .catch((err)=>[err,null])
    expect(err).toBe(null)
    
})