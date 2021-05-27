/**
 * Array of all boolean type questions. Questions of this type should only be added here.
 * This array is used to dynamically generate the routes, views, and validation
 */

// TODO: This schema needs to be expanded to be able to handle child text boxes and areas

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
];
