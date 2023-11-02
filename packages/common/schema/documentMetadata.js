/**
 * @typedef {Object} DocumentMetadata
 * @property {string} documentId - The unique identifier for the file. This will be different to documentReference
 * @property {string | undefined} caseRef
 * @property {number} caseId The unique identifier within the Back Office. This is not the same as the case reference
 * @property {string | null | undefined} documentReference - Reference used throughout ODT <CaseRef>-<SequenceNo>
 * @property {number | null} version
 * @property {string | null} examinationRefNo
 * @property {string | null} filename - Current stored filename of the file
 * @property {string | null} originalFilename - Original filename of file
 * @property {number | null} size
 * @property {string | null} mime
 * @property {string | undefined} documentURI
 * @property {string | undefined} publishedDocumentURI
 * @property {"not_scanned" | "scanned" | "affected | null"} virusCheckStatus
 * @property {string | null} fileMD5
 * @property {string | null} dateCreated - Date format: date-time
 * @property {string | undefined} lastModified - Date format: date-time
 * @property {"submitted" | "internal" | "draft"} documentStatus
 * @property {"not_redacted" | "redacted | null"} redactedStatus
 * @property {"not_checked" | "checked" | "ready_to_publish" | "do_not_publish" | "publishing" | "published" | "archived | null"} publishedStatus
 * @property {string | undefined} datePublished - Date format: date-time
 * @property {DocumentType | null} documentType
 * @property {"public" | "official" | "secret" | "top-secret | null"} securityClassification
 * @property {"appeals" | "back_office" | "horizon" | "ni_file" | "sharepoint | null"} sourceSystem
 * @property {"pins" | "citizen" | "lpa" | "ogd | null"} origin
 * @property {string | null} owner
 * @property {string | null} author - Name of person who authored document
 * @property {string | null} representative - The on behalf of or agent submitter of document
 * @property {string | null} description
 * @property {"draft" | "pre-application" | "acceptance" | "pre-examination" | "examination" | "recommendation" | "decision" | "post_decision" | "withdrawn" | "developers_application | null"} stage
 * @property {string | null} filter1 - Filter field to provide additional filtering
 * @property {string | null} filter2 - Filter field to provide additional filtering
 */

/**
 * @typedef {'Supporting Documents' | 'Appeal Statement' | 'Planning application form' | 'Decision notice'} DocumentType
 */

module.exports = {};
