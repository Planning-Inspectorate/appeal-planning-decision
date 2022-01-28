const createContact = require('./logic/createContact');

/**
 * Create Contacts
 *
 * Takes the body data, parses it into agent/appellant, creates the
 * contact inside Horizon and returns the data that is in the format
 * that can be used by the CreateCase endpoint.
 *
 * @param {*} log
 * @param {*} body
 * @returns {Promise}
 */
const createContacts = async (log, body) => {
  const contacts = [];
  let logMessage;

  // if no appeal type then default Householder Appeal Type - required as running HAS in parallel to Full Planning
  const appealTypeID = body.appeal.appealType === undefined ? '1001' : body.appeal.appealType;

  switch (appealTypeID) {
    case '1001': {
      if (body.appeal.aboutYouSection.yourDetails.isOriginalApplicant) {
        /* User is original applicant - just add appellant */
        logMessage = 'User is original applicant';
        contacts.push({
          type: 'Appellant',
          email: body.appeal.aboutYouSection.yourDetails.email,
          name: body.appeal.aboutYouSection.yourDetails.name,
        });
      } else {
        /* User is agent - add both agent and OP */
        logMessage = 'User is agent';
        contacts.push(
          {
            type: 'Agent',
            email: body.appeal.aboutYouSection.yourDetails.email,
            name: body.appeal.aboutYouSection.yourDetails.name,
          },
          {
            /* Email not collected here */
            type: 'Appellant',
            name: body.appeal.aboutYouSection.yourDetails.appealingOnBehalfOf,
          }
        );
      }

      break;
    }

    case '1005': {
      if (body.appeal.aboutYouSection.yourDetails.isOriginalApplicant) {
        /* User is original applicant - just add appellant */
        logMessage = 'User is original applicant';
        contacts.push({
          type: 'Appellant',
          email: body.appeal.contactDetailsSection.email,
          name: body.appeal.contactDetailsSection.name,
        });
      } else {
        /* User is agent - add both agent and OP */
        // eslint-disable-next-line no-unused-vars
        logMessage = 'User is agent';
        contacts.push(
          {
            type: 'Agent',
            email: body.appeal.contactDetailsSection.email,
            name: body.appeal.contactDetailsSection.name,
          },
          {
            /* Email not collected here */
            type: 'Appellant',
            name: body.appeal.aboutYouSection.yourDetails.appealingOnBehalfOf,
          }
        );
      }

      break;
    }

    default: {
      break;
    }
  }

  return Promise.all(
    contacts.map(async ({ name, email, type }) => {
      /* Create the user in Horizon */

      let [firstName, ...lastName] = name.split(' ');

      if (name.split(' ').length <= 1) {
        firstName = ',';
        // eslint-disable-next-line prefer-destructuring
        lastName = name.split(' ')[0];
      } else {
        // eslint-disable-next-line prefer-destructuring
        firstName = name.split(' ')[0];
        lastName = lastName.join(' ');
      }

      log('Inserting contact into Horizon');

      const contactId = await createContact(log, {
        firstName,
        lastName,
        email,
      });

      return {
        /* Add user contact details */
        key: 'Case Involvement:Case Involvement',
        value: [
          {
            key: 'Case Involvement:Case Involvement:ContactID',
            value: contactId?.id,
          },
          {
            key: 'Case Involvement:Case Involvement:Contact Details',
            value: name,
          },
          {
            key: 'Case Involvement:Case Involvement:Involvement Start Date',
            value: new Date(),
          },
          {
            key: 'Case Involvement:Case Involvement:Communication Preference',
            value: 'e-mail',
          },
          {
            key: 'Case Involvement:Case Involvement:Type Of Involvement',
            value: type,
          },
        ],
      };
    })
  );
};

module.exports = { createContacts };
