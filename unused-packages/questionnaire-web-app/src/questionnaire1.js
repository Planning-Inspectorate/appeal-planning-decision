var questionnaire = {
    "sections": [
        {
            "name": "Constraints, designations and other issues",
            "questions": [
                {
                    "question": "Would a public right of way need to be removed or diverted?",
                    "type": "boolean",
                    "fieldName": "right-of-way-check",
                    "required": true,
                    "show": (answers) => { return true; }
                },
                {
                    "question": "Upload the definitive map and statement extract",
                    "type": "multi-file-upload",
                    "fieldName": "right-of-way-upload",
                    "required": true,
                    "show": (answers) => { return answers["right-of-way-check"] === true; }
                },
                {
                    "question": "Is the development in, near or likely to affect any designated sites?",
                    "type": "checkbox",
                    "fieldName": "right-of-way-check",
                    "required": true,
                    "show": (answers) => { return true; },
                    "options": [
                        {
                            "text": "SSSI (site of special scientific interest)",
                            "value": "SSSI"
                        },
                        {
                            "text": "Other",
                            "value": "other",
                            "conditional": {
                                "question": "Other designation(s)",
                                "type": "text",
                                "fieldName": "other-desigations",
                            }
                        },
                        {
                            "divider": "or"
                        },
                        {
                            "text": "No, it is not in, near or likely to affect any designated sites",
                            "value": "None"
                        },
                    ]
                }
            ]
        }
    ]
}