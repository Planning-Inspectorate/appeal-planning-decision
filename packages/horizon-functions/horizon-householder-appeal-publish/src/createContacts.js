const createContact = require('./logic/createContact');
const createOrganisation = require('./logic/createOrganisation');

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

  // if no appeal type then default Householder Appeal Type (1001) - required as running HAS in parallel to Full Planning
  const appealTypeID = body.appeal.appealType == null ? '1001' : body.appeal.appealType;

  switch (appealTypeID) {
    case '1001': {
      // Householder (HAS) Appeal
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
            company: null,
          },
          {
            /* Email not collected here */
            type: 'Appellant',
            name: body.appeal.aboutYouSection.yourDetails.appealingOnBehalfOf,
            company: null,
          }
        );
      }

      break;
    }

    case '1005': {
      if (body.appeal.contactDetailsSection.isOriginalApplicant) {
        /* User is original applicant - just add appellant */
        logMessage = 'User is original applicant';
        contacts.push({
          type: 'Appellant',
          email: body.appeal.contactDetailsSection.contact.email,
          name: body.appeal.contactDetailsSection.contact.name,
          company: body.appeal.contactDetailsSection.contact.companyName,
        });
      } else {
        /* User is agent - add both agent and OP */
        // eslint-disable-next-line no-unused-vars
        logMessage = 'User is agent';
        contacts.push(
          {
            type: 'Agent',
            email: body.appeal.contactDetailsSection.contact.email,
            name: body.appeal.contactDetailsSection.contact.name,
            company: body.appeal.contactDetailsSection.contact.companyName,
          },
          {
            /* Email not collected here */
            type: 'Appellant',
            name: body.appeal.contactDetailsSection.appealingOnBehalfOf.name,
            company: body.appeal.contactDetailsSection.appealingOnBehalfOf.companyName,
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
    contacts.map(async ({ name, email, type, company }) => {
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

      let organisationId = null;
      let contactId = null;

      if (typeof company !== 'undefined') {
        log('Insert organisation into Horizon');

        organisationId = await createOrganisation(log, company);

        log('Insert contact into Horizon ');

        contactId = await createContact(log, {
          firstName,
          lastName,
          email,
          organisationId,
        });

        log({ organisationId }, 'Organisation Identifier');
        log({ contactId }, 'Contact Identifier');
      } else {
        log('Insert contact into Horizon ');

        contactId = await createContact(log, {
          firstName,
          lastName,
          email,
        });

        log({ contactId }, 'Contact Identifier');
      }

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
