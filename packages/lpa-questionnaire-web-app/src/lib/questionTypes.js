/**
 * Array of all boolean type questions. Questions of this type should only be added here.
 * This array is used to dynamically generate the routes (and this the views, and validation also)
 *
 * data structure as folllows (* are required):
 * id*: ID to associate with the question. Should match ID in task.service and model.
 * heading*: h1 for the page,
 * section*: What section it belongs to. Currently only used for display purposes
 * hint: text to display in the hint for the question
 * emptyError: error to show if the boolean question is not filled. If left empty,
 *  question will be treated as optional.
 * url*: url for the question, should match task.service
 * dataId: if question has textarea/input child, this should be the value in model. Will default to value.
 * text (required fields only if text child exists):
 *  id*: identifier for text input. Should match model
 *  emptyError*: error to display if text field is empty
 *  parentValue: what value the parent should have to toggle the text box
 *  label: label to display for the input
 *  hint: any hint to show for text field
 *  textarea: whether text box should render as textarea. If false renders as text input
 */

exports.booleanQuestions = [
  {
    id: 'siteSeenPublicLand',
    heading: 'Can the Inspector see the relevant parts of the appeal site from public land?',
    section: 'About the Appeal Site',
    title:
      'Can the Inspector see the relevant parts of the appeal site from public land? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
    emptyError: 'Select yes if relevant parts of the site can be seen from public land',
    url: 'public-land',
  },
  {
    id: 'enterAppealSite',
    heading: 'Would the Inspector need to enter the appeal site?',
    section: 'About the Appeal Site',
    title:
      'Would the Inspector need to enter the appeal site? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
    emptyError: 'Select yes if the Inspector would need to enter the appeal site',
    url: 'site-access',
    dataId: 'mustEnter',
    text: {
      id: 'enterReasons',
      emptyError: 'Enter the reasons the Inspector would need to enter the appeal site',
      parentValue: true,
      label: 'Tell us why the Inspector will need to enter the appeal site',
      textarea: true,
    },
  },
  {
    id: 'accessNeighboursLand',
    heading: "Would the Inspector need access to a neighbour's land?",
    section: 'About the Appeal Site',
    title:
      "Would the Inspector need access to a neighbour's land? - Appeal questionnaire - Appeal a householder planning decision - GOV.UK",
    emptyError: 'Select yes if the Inspector needs access to a neighbour’s land',
    url: 'neighbours-land',
    dataId: 'needsAccess',
    text: {
      id: 'addressAndReason',
      emptyError: "Enter the reasons the Inspector would need to enter a neighbour's land",
      parentValue: true,
      label: 'Tell us the full address and why you think a visit is required',
    },
  },
  {
    id: 'listedBuilding',
    heading: 'Would the development affect the setting of a listed building?',
    section: 'About the Appeal Site',
    title:
      'Would the development affect the setting of a listed building? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
    emptyError: 'Select yes if the development affects the setting of a listed building',
    url: 'listed-building',
    dataId: 'affectSetting',
    text: {
      id: 'buildingDetails',
      emptyError: 'Enter the details for the listed building',
      parentValue: true,
      label:
        'Add the relevant listing description from the List of Buildings of Special Architectural or Historic Interest',
      textarea: true,
    },
  },
  {
    id: 'greenBelt',
    heading: 'Is the appeal site in a green belt?',
    section: 'About the Appeal Site',
    title:
      'Is the appeal site in a greenbelt? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
    url: 'green-belt',
    emptyError: 'Select yes if the appeal site is in a green belt',
  },
  {
    id: 'nearConservationArea',
    heading: 'Is the appeal site in or near a conservation area?',
    section: 'About the Appeal Site',
    title:
      'Is the appeal site in or near a conservation area? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
    url: 'conservation-area',
    emptyError: 'Select yes if the appeal site is in or near a conservation area',
  },
  {
    id: 'originalPlanningApplicationPublicised',
    heading: 'Did you publicise the original planning application?',
    section: 'Optional supporting documents',
    title:
      'Original planning application publicity - Appeal questionnaire - Appeal a householder planning decision - GOV.UK',
    url: 'application-publicity',
    emptyError: 'Did you publicise the original planning application?',
  },
];
