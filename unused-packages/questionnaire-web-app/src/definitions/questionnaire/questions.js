/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const listedBuildingController = require('../../controllers/listedBuildingLookup');

// Define all questions
exports.questions = {
    appealTypeAppropriate: {
        title: "Is this appeal type appriopriate?", //Title used in the summary list
        question: "Do you think the appeal type is appropriate?", //The question being asked
        type: "boolean", //Type of question, mapped to a njk view in /views/questions
        fieldName: "appropriate-appeal-type", //The name of the html input field / stem of the name for screens with multiple fields
        required: true, //Whether the field should be required - this will need to be tied in to validation alongside allowing more complex validation rules
        show: (answers) => { return true; }, // A function accepting an array of answers and returning a boolean value indicating whether this field should be shown based on the answers given so far
        validator: {type:"boolean"}
    },
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
        required: false,
        taskList: false,
        show: (answers) => { return answers["listed-building-check"] === "yes"; }
    },
    listedBuildingDetailList: {
        title: "Listed buildings list",
        question: "Manage listed buildings",
        type: "custom",
        renderAction: listedBuildingController.manageListedBuildings, //For scenarios where more complex rendering logic is required, pass a controller action
        saveAction: listedBuildingController.lookupCode, //For scenarios where more complex saving/POST handling logic is required, pass a controller action
        fieldName: "listed-detail-list",
        required: false,
        altText: "Started",
        show: (answers) => { return answers["listed-detail-list"]?.length > 0; }
    },
    conservationArea: {
        title: "Conservation area",
        question: "Is the site in or next to a conservation area?",
        type: "boolean",
        fieldName: "conservation-area",
        required: true,
        show: (answers) => { return true; }
    },
    conservationAreaUpload: {
        title: "Conservation area map and guidance",
        question: "Upload conservation map and guidance",
        description: "<a href=\"https://magic.defra.gov.uk/magicmap.aspx\" target=\"_blank\" class=\"govuk-link\">Link to Magic Maps (opens in new tab)</a>",
        type: "multi-file-upload",
        fieldName: "conservation-area-upload",
        required: true,
        show: (answers) => { return answers["conservation-area"] === "yes"; }
    },    
    greenBelt: {
        title: "Green belt",
        question: "Is the site in a green belt?",
        type: "boolean",
        fieldName: "green-belt",
        required: true,
        show: (answers) => { return true; }
    },
    whoWasNotified: {
        title: "Who was notified",
        question: "Who was notified",
        description: "This should include internal consultees.",
        type: "multi-file-upload",
        fieldName: "who-was-notified-upload",
        required: true,
        show: (answers) => { return true; }
    },
    howYouNotifiedPeople: {
        title: "How you notified people",
        question: "How did you notify people about the application?",
        description: "Select all that apply",
        type: "checkbox",
        fieldName: "notification-method",
        required: true,
        show: (answers) => { return true; },
        options: [ //Options for checkboxes / radio buttons
            {
                text: "Site notice",
                value: "Site notice"
            },
            {
                text: "Letters to neighbours",
                value: "Letters to neighbours"
            },
            {
                text: "Advertisement",
                value: "Advertisement"
            },
        ]
    },
    siteNoticeUpload: {
        title: "Site notice",
        question: "Upload site notice",
        type: "multi-file-upload",
        fieldName: "site-notice-upload",
        required: true,
        show: (answers) => { return (answers["notification-method"] ?? "").includes("Site notice"); }
    },
    lettersToNeighboursUpload: {
        title: "Letters to neighbours",
        question: "Upload letters to neighbours",
        type: "multi-file-upload",
        fieldName: "letters-to-neighbours-upload",
        required: true,
        show: (answers) => { return (answers["notification-method"] ?? "").includes("Letters to neighbours"); }
    },
    advertisementUpload: {
        title: "Advertisement",
        question: "Upload advertisement",
        type: "multi-file-upload",
        fieldName: "advertisement-upload",
        required: true,
        show: (answers) => { return (answers["notification-method"] ?? "").includes("Advertisement"); }
    },
    representationsFromOthers: {
        title: "Representations from other parties",
        question: "Did you receive representations from other parties?",
        type: "boolean",
        fieldName: "representations-from-others",
        required: true,
        show: (answers) => { return true; }
    },
    representationUpload: {
        title: "Upload representations",
        question: "Upload representations from other parties",
        type: "multi-file-upload",
        fieldName: "representation-upload",
        required: true,
        show: (answers) => { return answers["representations-from-others"] === "yes"; }
    },
    planningOfficersUpload: {
        title: "Upload planning officers report",
        question: "Upload planning officer’s report",
        type: "multi-file-upload",
        fieldName: "planning-officers-upload",
        required: true,
        show: (answers) => { return true; }
    },
    accessForInspection: {
        title: "Access for inspection",
        question: "Might the inspector need access to the appellant’s land or property??",
        type: "boolean",
        fieldName: "access-for-inspection",
        required: true,
        show: (answers) => { return true; }
    },
    // Todo uniqueness validation
    potentialSafetyRisks: {
        title: "Potential safety risks",
        question: "Add potential safety risks",
        subQuestion: "Are there any potential safety risks?",
        description: "You need to tell inspectors how to prepare for a site visit and what to bring. \n \n What you tell us might include:",
        points: ["there is no, or limited mobile reception", "access is blocked", "ladders or other equipment is needed", "site health and safety rules need to be followed (for instance, a hard hat, boots and hi visibility clothing)", "there is livestock or other animals", "there is dangerous debris or overgrown vegetation", "there is potentially hazardous material, such as asbestos"],
        conditional: 'Add details of the potential risk and what the inspector might need',
        conditionalId: 'potential-safety-risks-correct-details',
        type: "boolean-text",
        fieldName: "potential-safety-risks",
        required: false,
        show: (answers) => { return answers["access-for-inspection"] === "yes"; },
        validator: {type:"boolean-text", maxLength: 100, textField:"potential-safety-risks-correct-details", selectionRequiredErrorMessage: "You must select yes or no"}
    }, 
    /*S78 questions */
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