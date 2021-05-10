// both included explicitly for reference
const appealDocumentTypes = {
  'Application Form': 'Appellant Initial Documents',
  'Decision Notice': 'LPA Decision Notice',
  'Appeal Statement': 'Appellant Grounds of Appeal',
  'Any supporting docs': 'Appellant Grounds of Appeal',
  'Submission information file PDF': 'Appellant Initial Documents',
};

const replyDocumentTypes = {
  'Conservation Area': 'LPA Questionnaire Documents',
  Plans: 'LPA Questionnaire Documents',
  'Planning Officers report': 'LPA Questionnaire Documents',
  'Letter/Site notice': 'Consultation Responses',
  'List of interested parties addresses': 'Consultation Responses',
  'Representations from Interested parties': 'Consultation Responses',
  'Notifying interested parties about the appeal': 'Appeal Notification Letter',
  'Site notices': 'LPA Questionnaire Documents',
  'Planning history': 'LPA Questionnaire Documents',
  'Statutory development plan': 'Development Plans',
  'Other relevant policies': 'LPA Questionnaire Documents',
  'Supplementary planning documents': 'Supplementary Guidance',
  'Development Plan or Neighbourhood plan': 'Development Plans',
};

module.exports = { appealDocumentTypes, replyDocumentTypes };
