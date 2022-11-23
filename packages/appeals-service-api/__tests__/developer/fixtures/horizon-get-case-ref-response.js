/**
 * 
 * @param {string} isoDateString Please format this as "YYYY-MM-DDTHH:MM:SS+00:00" 
 */
const getCaseReferenceResponseJson = (javascriptDateObject) =>  {
    Envelope: {
        Body: {
            GetCaseResponse: {
                GetCaseResult: {
                    Metadata: {
                        Attributes: [
                            {
                                Name: {
                                    value: 'Case Document Dates:Final Comments Due Date'
                                },
                                Value: {
                                    value: '2100-12-31T00:00:00+00:00'
                                }
                            },
                            {
                                Name: {
                                    value: 'Curb your'
                                },
                                Value: {
                                    value: 'enthusiasm'
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
};