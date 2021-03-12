function getTask(sectionTaskName) {
  let name = '';
  let url = '';
  switch (sectionTaskName) {
    case 'About you - Who are you Section':
      name = 'whoAreYou';
      url = '/appeal-householder-decision/who-are-you';
      break;
    case 'About you - Your details Section':
      name = 'yourDetailsName';
      url = '/appeal-householder-decision/your-details';
      break;
    case 'About you - Appealing of behalf of Section':
      name = 'appealingOnBehalfOf';
      url = '/appeal-householder-decision/applicant-name';
      break
    case 'About you - Your details':
      name = 'yourDetails';
      url = '/appeal-householder-decision/who-are-you';
      break;
    case 'Planning application - Application number':
      name = 'applicationNumber';
      url = '/appeal-householder-decision/application-number';
      break;
    case 'Planning application - Upload application':
      name = 'uploadApplication';
      url = '/appeal-householder-decision/upload-application';
      break;
    case 'Planning application - Upload decision letter':
      name = 'decisionLetter';
      url = '/appeal-householder-decision/upload-decision';
      break;
    case 'Your appeal - Appeal statement':
      name = 'appealStatement';
      url = '/appeal-householder-decision/appeal-statement';
      break;
    case 'Your appeal - Supporting documents':
      name = 'otherDocuments';
      url = '/appeal-householder-decision/supporting-documents';
      break;
    case 'Appeal site - Site location':
      name = 'siteAddress';
      url = '/appeal-householder-decision/site-location';
      break;
    case 'Appeal site - Site ownership':
      name = 'siteOwnership';
      url = '/appeal-householder-decision/site-ownership';
      break;
    case 'Appeal site - Site access':
      name = 'siteAccess';
      url = '/appeal-householder-decision/site-access';
      break;
    case 'Appeal site - Site safety':
      name = 'healthAndSafety';
      url = '/appeal-householder-decision/site-access-safety';
      break;
    case 'Appeal submit - Check your answers':
      name = 'checkYourAnswers';
      url = '/appeal-householder-decision/check-answers';
      break;

    default:
      throw new Error('Unknown task name = ' + name);
  }

  return { name, url };
}

module.exports = {
  getTask
};
