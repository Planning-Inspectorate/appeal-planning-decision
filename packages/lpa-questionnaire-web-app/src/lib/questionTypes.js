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
    heading: 'Can the inspector see the relevant parts of the appeal site from public land?',
    section: 'About the Appeal Site',
    title:
      'Can the inspector see the relevant parts of the appeal site from public land? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
    emptyError: 'Select yes if relevant parts of the site can be seen from public land',
    url: 'public-land',
  },
  {
    id: 'enterAppealSite',
    heading: 'Would the inspector need to enter the appeal site?',
    section: 'About the Appeal Site',
    title:
      'Would the Inspector need to enter the appeal site? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
    emptyError: 'Select yes if the inspector would need to enter the appeal site',
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
];
