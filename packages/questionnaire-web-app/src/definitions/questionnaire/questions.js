/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const listedBuildingController = require('../../controllers/listedBuildingLookup');

// Define all questions
exports.questions = {
    listedBuildingCheck: {
        title: "Affects a listed building", //Title used in the summary list
        question: "Could the plans affect the setting of a listed building or site?", //The question being asked
        type: "boolean", //Type of question, mapped to a njk view in /views/questions
        fieldName: "listed-building-check", //The name of the html input field / stem of the name for screens with multiple fields
        required: true, //Whether the field should be required - this will need to be tied in to validation alongside allowing more complex validation rules
        show: (answers) => { return true; } // A function accepting an array of answers and returning a boolean value indicating whether this field should be shown based on the answers given so far
    },
    listedBuildingDetail: {
        title: "Listed buildings",
        question: "Add the listed entry number",
        type: "custom",
        renderAction: listedBuildingController.enterNumber, //For scenarios where more complex rendering logic is required, pass a controller action
        saveAction: listedBuildingController.lookupCode, //For scenarios where more complex saving/POST handling logic is required, pass a controller action
        fieldName: "listed-entry-number",
        required: true,
        show: (answers) => { return answers["listed-building-check"] === "yes"; }
    },
    rightOfWayCheck: {
        title: "Public right of way",
        question: "Would a public right of way need to be removed or diverted?",
        type: "boolean",
        fieldName: "right-of-way-check",
        required: true,
        show: (answers) => { return true; }
    },
    rightOfWayUpload: {
        title: "Definitive map and statement extract",
        question: "Upload the definitive map and statement extract",
        type: "multi-file-upload",
        fieldName: "right-of-way-upload",
        required: true,
        show: (answers) => { return answers["right-of-way-check"] === "yes"; }
    },
    designatedSitesCheck: {
        title: "Designated sites",
        question: "Is the development in, near or likely to affect any designated sites?",
        type: "checkbox",
        fieldName: "designated-sites-check",
        required: true,
        show: (answers) => { return true; },
        options: [ //Options for checkboxes / radio buttons
            {
                text: "SSSI (site of special scientific interest)",
                value: "SSSI"
            },
            {
                text: "Other",
                value: "other",
                conditional: {
                    question: "Other designation(s)",
                    type: "text",
                    fieldName: "other-desigations",
                }
            },
            {
                divider: "or"
            },
            {
                text: "No, it is not in, near or likely to affect any designated sites",
                value: "None",
                behaviour: "exclusive"
            },
        ]
    }
};
