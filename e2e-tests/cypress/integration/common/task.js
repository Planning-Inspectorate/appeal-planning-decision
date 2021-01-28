function getTask(sectionTaskName) {
  let name = '';
  let url = '';
  switch (sectionTaskName) {
    case 'About you - Who are you Section':
      name = 'whoAreYou';
      url = '/appellant-submission/who-are-you';
      break;
    case 'About you - Your details Section':
      name = 'yourDetailsName';
      url = '/appellant-submission/your-details';
      break;
    case 'About you - Appealing of behalf of Section':
      name = 'appealingOnBehalfOf';
      url = '/appellant-submission/applicant-name';
      break
    case 'About you - Your details':
      name = 'yourDetails';
      url = '/appellant-submission/who-are-you';
      break;
    case 'Planning application - Application number':
      name = 'applicationNumber';
      url = '/appellant-submission/application-number';
      break;
    case 'Planning application - Upload application':
      name = 'uploadApplication';
      url = '/appellant-submission/upload-application';
      break;
    case 'Planning application - Upload decision letter':
      name = 'decisionLetter';
      url = '/appellant-submission/upload-decision';
      break;
    case 'Your appeal - Appeal statement':
      name = 'appealStatement';
      url = '/appellant-submission/appeal-statement';
      break;
    case 'Your appeal - Supporting documents':
      name = 'otherDocuments';
      url = '/appellant-submission/supporting-documents';
      break;
    case 'Appeal site - Site location':
      name = 'siteAddress';
      url = '/appellant-submission/site-location';
      break;
    case 'Appeal site - Site ownership':
      name = 'siteOwnership';
      url = '/appellant-submission/site-ownership';
      break;
    case 'Appeal site - Site access':
      name = 'siteAccess';
      url = '/appellant-submission/site-access';
      break;
    case 'Appeal site - Site safety':
      name = 'healthAndSafety';
      url = '/appellant-submission/site-access-safety';
      break;
    case 'Appeal submit - Check your answers':
      name = 'checkYourAnswers';
      url = '/appellant-submission/check-answers';
      break;

    default:
      throw new Error('Unknown task name = ' + name);
  }

  return { name, url };
}

module.exports = {
  getTask
};
