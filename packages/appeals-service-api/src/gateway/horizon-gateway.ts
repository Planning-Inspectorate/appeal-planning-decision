const jp = require('jsonpath');
const config = require('../configuration/config');
const axios = require('axios');
const fetch = require('node-fetch')
export class HorizonGateway {

    async getFinalCommentsDueDate(caseReference: string): Promise<Date | undefined> {
        
        const requestBody = {
            "GetCase": {
                "__soap_op": "http://tempuri.org/IHorizon/GetCase",
                "__xmlns": "http://tempuri.org/",
                "caseReference": caseReference
            }
        }    
        
        console.log(config.services.horizon.url, requestBody)
        // const caseDetails = await got.post(config.services.horizon.url, { json: requestBody}).json();
        let caseDetails = await fetch(config.services.horizon.url, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        })
        console.log(caseDetails);
        const finalCommentsDueDate = jp.query(caseDetails, '$..Attributes[*].Name[?(@.Name.value=="Case Document Dates:Final Comments Due Date")]');
        console.log(finalCommentsDueDate);
        if (finalCommentsDueDate == false) {
            return undefined;
        }
        return new Date(Date.parse(finalCommentsDueDate));
    }

}