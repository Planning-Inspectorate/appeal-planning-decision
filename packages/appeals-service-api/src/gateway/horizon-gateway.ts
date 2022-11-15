const axios = require('axios').default
const jp = require('jsonpath');
const config = require('../configuration/config')

export class HorizonGateway {

    async getFinalCommentsDueDate(caseReference: string): Promise<Date | undefined> {
        
        const requestBody = {
            "GetCase": {
                "__soap_op": "http://tempuri.org/IHorizon/GetCase",
                "__xmlns": "http://tempuri.org/",
                "caseReference": caseReference
            }
        }    
        
        console.log(config.services.horizon.url);
        const caseDetails = await axios.post(config.services.horizon.url, requestBody);
        const finalCommentsDueDate = jp.query(caseDetails.body, '$..Attributes[*].Name[?(@.Name.value=="Case Document Dates:Final Comments Due Date")]');
        console.log(finalCommentsDueDate);
        if (finalCommentsDueDate == false) {
            return undefined;
        }
        return new Date(Date.parse(finalCommentsDueDate));
    }

}