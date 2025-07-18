const lpaSections = require('./lpa-user-sections').sections;
const appellantSections = require('./appellant-sections').sections;
const rule6Sections = require('./rule-6-sections').sections;
const {
	APPEAL_USER_ROLES,
	REPRESENTATION_TYPES,
	LPA_USER_ROLE
} = require('@pins/common/src/constants');
const { APPEAL_REPRESENTATION_STATUS } = require('@planning-inspectorate/data-model');

const { addDays } = require('date-fns');

const currentDate = new Date();

describe('LPA and Appellant Sections', () => {
	let appealCase;
	beforeEach(() => {
		appealCase = {
			caseValidDate: '2023-09-01',
			// statusPlanningObligation: 'finalised',

			// lpaq
			lpaQuestionnaireDueDate: addDays(currentDate, 7),
			lpaQuestionnaireSubmittedDate: null,
			lpaQuestionnairePublishedDate: null,
			// statements
			statementDueDate: addDays(currentDate, 35),
			appellantStatementSubmittedDate: null,
			LPAStatementSubmittedDate: null,
			// ip comments
			interestedPartyRepsDueDate: addDays(currentDate, 38),
			// final comments
			finalCommentsDueDate: addDays(currentDate, 40),
			LPACommentsSubmittedDate: null,
			appellantCommentsSubmittedDate: null,
			// proofs
			proofsOfEvidenceDueDate: addDays(currentDate, 42),
			appellantProofsSubmittedDate: null,
			LPAProofsSubmittedDate: null
		};
	});

	/**
	 * @param {import("@pins/common/src/view-model-maps/sections/def").Sections} sections
	 * @param {string} heading
	 */
	const findSectionByHeading = (sections, heading) => {
		return sections.find((section) => section.heading === heading);
	};

	/**
	 * @param {import("@pins/common/src/view-model-maps/sections/def").Section} section
	 * @param {string} url
	 */
	const findLinkByUrl = (section, url) => {
		return section.links.find((link) => link.url === url);
	};

	describe('LPA Sections', () => {
		describe('Appeal details', () => {
			it('should show "View appeal details" when caseValidDate is present', () => {
				const section = findSectionByHeading(lpaSections, 'Appeal details');
				const link = findLinkByUrl(section, '/appeal-details');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View appeal details');
			});

			it('should not show "View appeal details" when caseValidDate is absent', () => {
				appealCase.caseValidDate = null;
				const section = findSectionByHeading(lpaSections, 'Appeal details');
				const link = findLinkByUrl(section, '/appeal-details');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Questionnaire', () => {
			it('should show "View questionnaire" when lpaQuestionnaireSubmittedDate is present', () => {
				appealCase.lpaQuestionnaireSubmittedDate = '2023-09-02';
				const section = findSectionByHeading(lpaSections, 'Questionnaire');
				const link = findLinkByUrl(section, '/questionnaire');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View questionnaire');
			});

			it('should not show "View questionnaire" when lpaQuestionnaireSubmittedDate is absent', () => {
				appealCase.lpaQuestionnairePublishedDate = null;
				const section = findSectionByHeading(lpaSections, 'Questionnaire');
				const link = findLinkByUrl(section, '/questionnaire');
				expect(link.condition(appealCase)).toBe(false);
			});
		});

		describe('Statements', () => {
			it('should show "View your statement" when user owned statement is present', () => {
				appealCase.Representations = [
					{
						submittingPartyType: LPA_USER_ROLE,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: true,
						representationType: REPRESENTATION_TYPES.STATEMENT
					}
				];
				const section = findSectionByHeading(lpaSections, 'Statements');
				const link = findLinkByUrl(section, '/statement');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your statement');
			});

			it('should not show "View your statement" when user owned statement is not present', () => {
				appealCase.Representations = [
					{
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.STATEMENT
					}
				];
				const section = findSectionByHeading(lpaSections, 'Statements');
				const link = findLinkByUrl(section, '/statement');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it('should show "View other party statements" when a rule6Statement is published', () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.RULE_6_PARTY,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.STATEMENT
					}
				];
				const section = findSectionByHeading(lpaSections, 'Statements');
				const link = findLinkByUrl(section, '/other-party-statements');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View other party statements');
			});

			it('should not show "View other party statements" when rule6StatementPublished is absent', () => {
				appealCase.rule6StatementPublished = null;
				const section = findSectionByHeading(lpaSections, 'Statements');
				const link = findLinkByUrl(section, '/other-party-statements');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Interested party comments', () => {
			it('should show "View interested party comments" when interestedPartyCommentsPublished is true', () => {
				appealCase.Representations = [
					{
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
					}
				];
				const section = findSectionByHeading(lpaSections, 'Interested party comments');
				const link = findLinkByUrl(section, '/interested-party-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View interested party comments');
			});

			it('should not show "View interested party comments" when interestedPartyCommentsPublished is absent', () => {
				const section = findSectionByHeading(lpaSections, 'Interested party comments');
				const link = findLinkByUrl(section, '/interested-party-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Planning obligation', () => {
			it('should show "View the appellant’s planning obligation" when statusPlanningObligation is true', () => {
				appealCase.statusPlanningObligation = 'finalised';
				const section = findSectionByHeading(lpaSections, 'Planning obligation');
				const link = findLinkByUrl(section, '/appellant-planning-obligation');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View the appellant’s planning obligation');
			});

			it('should not show "View the appellant’s planning obligation" when statusPlanningObligation is absent', () => {
				appealCase.statusPlanningObligation = null;
				const section = findSectionByHeading(lpaSections, 'Planning obligation');
				const link = findLinkByUrl(section, '/appellant-planning-obligation');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Final comments', () => {
			it('should show "View your final comments" when owned FINAL_COMMENT is present', () => {
				appealCase.Representations = [
					{
						submittingPartyType: LPA_USER_ROLE,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: true,
						representationType: REPRESENTATION_TYPES.FINAL_COMMENT
					}
				];
				const section = findSectionByHeading(lpaSections, 'Final comments');
				const link = findLinkByUrl(section, '/final-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your final comments');
			});

			it('should not show "View your final comments" when LPACommentsSubmittedDate is absent', () => {
				appealCase.Representations = [
					{
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.FINAL_COMMENT
					}
				];
				const section = findSectionByHeading(lpaSections, 'Final comments');
				const link = findLinkByUrl(section, '/final-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it('should show "View appellant final comments" when appellant comment is published ', () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.APPELLANT,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.FINAL_COMMENT
					}
				];
				const section = findSectionByHeading(lpaSections, 'Final comments');
				const link = findLinkByUrl(section, '/appellant-final-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View appellant final comments');
			});

			it('should not show "View appellant final comments" when when appellant comment is not published', () => {
				appealCase.appellantCommentsSubmittedDate = null;
				const section = findSectionByHeading(lpaSections, 'Final comments');
				const link = findLinkByUrl(section, '/appellant-final-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Proof of evidence and witnesses', () => {
			it('should show "View your proof of evidence and witnesses" when owned PROOFS_OF_EVIDENCE is present', () => {
				appealCase.Representations = [
					{
						submittingPartyType: LPA_USER_ROLE,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: true,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your proof of evidence and witnesses');
			});

			it('should not show "View your proof of evidence and witnesses" when no owned PROOFS_OF_EVIDENCE is present', () => {
				appealCase.Representations = [
					{
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it("should show 'View the appellant's proof of evidence and witnesses' when appellant proof is published", () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.APPELLANT,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/appellant-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe("View the appellant's proof of evidence and witnesses");
			});

			it("should not show 'View the appellant's proof of evidence and witnesses' when appellant proof is not published", () => {
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/appellant-proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it("should show 'View proof of evidence and witnesses from other parties' when any rule 6 proofs is published", () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.RULE_6_PARTY,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/other-party-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View proof of evidence and witnesses from other parties');
			});

			it("should not show 'View proof of evidence and witnesses from other parties' when no rule proofs are published", () => {
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/other-party-proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});
	});

	describe('Appellant Sections', () => {
		describe('Appeal details', () => {
			it('should show "View your appeal details" when caseValidDate is present (is always true)', () => {
				const section = findSectionByHeading(appellantSections, 'Appeal details');
				const link = findLinkByUrl(section, '/appeal-details');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your appeal details');
			});
		});

		describe('Questionnaire', () => {
			it('should show "View questionnaire" when lpaQuestionnairePublishedDate is present', () => {
				appealCase.lpaQuestionnairePublishedDate = '2023-09-02';
				const section = findSectionByHeading(appellantSections, 'Questionnaire');
				const link = findLinkByUrl(section, '/questionnaire');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View questionnaire');
			});

			it('should not show "View questionnaire" when lpaQuestionnairePublishedDate is absent', () => {
				const section = findSectionByHeading(appellantSections, 'Questionnaire');
				const link = findLinkByUrl(section, '/questionnaire');
				expect(link.condition(appealCase)).toBe(false);
			});
		});

		describe('Statements', () => {
			it('should show "View local planning authority statement" when lpa Statement is published', () => {
				appealCase.Representations = [
					{
						submittingPartyType: LPA_USER_ROLE,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.STATEMENT
					}
				];
				const section = findSectionByHeading(appellantSections, 'Statements');
				const link = findLinkByUrl(section, '/lpa-statement');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View local planning authority statement');
			});

			it('should not show "View local planning authority statement" when lpa Statement is not published', () => {
				const section = findSectionByHeading(appellantSections, 'Statements');
				const link = findLinkByUrl(section, '/lpa-statement');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it('should show "View other party statements" when any other statement is published', () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.RULE_6_PARTY,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.STATEMENT
					}
				];
				const section = findSectionByHeading(appellantSections, 'Statements');
				const link = findLinkByUrl(section, '/other-party-statements');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View other party statements');
			});

			it('should not show "View other party statements" when no other statement is published', () => {
				const section = findSectionByHeading(appellantSections, 'Statements');
				const link = findLinkByUrl(section, '/other-party-statements');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Interested party comments', () => {
			it('should show "View interested party comments" when any IP comment is published', () => {
				appealCase.Representations = [
					{
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
					}
				];
				const section = findSectionByHeading(appellantSections, 'Interested party comments');
				const link = findLinkByUrl(section, '/interested-party-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View interested party comments');
			});

			it('should not show "View interested party comments" when no IP comments are published', () => {
				appealCase.interestedPartyCommentsPublished = null;
				const section = findSectionByHeading(appellantSections, 'Interested party comments');
				const link = findLinkByUrl(section, '/interested-party-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Planning obligation', () => {
			it('should show "View planning obligation" when statusPlanningObligation is set', () => {
				appealCase.statusPlanningObligation = 'finalised';
				const section = findSectionByHeading(appellantSections, 'Planning obligation');
				const link = findLinkByUrl(section, '/planning-obligation');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View planning obligation');
			});

			it('should not show "View planning obligation" when statusPlanningObligation is absent', () => {
				appealCase.statusPlanningObligation = null;
				const section = findSectionByHeading(appellantSections, 'Planning obligation');
				const link = findLinkByUrl(section, '/planning-obligation');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Final comments', () => {
			it('should show "View your final comments" when user has owned final comment', () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.APPELLANT,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: true,
						representationType: REPRESENTATION_TYPES.FINAL_COMMENT
					}
				];
				const section = findSectionByHeading(appellantSections, 'Final comments');
				const link = findLinkByUrl(section, '/final-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your final comments');
			});

			it('should not show "View your final comments" when user has no owned final comments', () => {
				appealCase.Representations = [
					{
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.FINAL_COMMENT
					}
				];
				const section = findSectionByHeading(appellantSections, 'Final comments');
				const link = findLinkByUrl(section, '/final-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it('should show "View local planning authority final comments" when lpaFinalCommentsPublished is true', () => {
				appealCase.Representations = [
					{
						submittingPartyType: LPA_USER_ROLE,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.FINAL_COMMENT
					}
				];
				const section = findSectionByHeading(appellantSections, 'Final comments');
				const link = findLinkByUrl(section, '/lpa-final-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View local planning authority final comments');
			});

			it('should not show "View local planning authority final comments" when lpaFinalCommentsPublished is absent', () => {
				appealCase.lpaFinalCommentsPublished = null;
				const section = findSectionByHeading(appellantSections, 'Final comments');
				const link = findLinkByUrl(section, '/lpa-final-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Proof of evidence and witnesses', () => {
			it('should show "View your proof of evidence and witnesses" when owned PROOFS_OF_EVIDENCE is present', () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.APPELLANT,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: true,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your proof of evidence and witnesses');
			});

			it('should not show "View your proof of evidence and witnesses" when no owned PROOFS_OF_EVIDENCE is present', () => {
				appealCase.Representations = [
					{
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it("should show 'View the local planning authority proof of evidence and witnesses' when lpa proofs are published", () => {
				appealCase.Representations = [
					{
						submittingPartyType: LPA_USER_ROLE,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/lpa-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe(
					'View the local planning authority proof of evidence and witnesses'
				);
			});

			it("should not show 'View the local planning authority proof of evidence and witnesses' when lpa proofs are not published", () => {
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/lpa-proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it("should show 'View other party proof of evidence and witnesses' when any rule 6 proofs are published", () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.RULE_6_PARTY,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/other-party-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View other party proof of evidence and witnesses');
			});

			it("should not show 'View proof of evidence and witnesses from other parties' when no rule 6 proofs are published", () => {
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/other-party-proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});
	});

	describe('Rule 6 Sections', () => {
		describe('Appeal details', () => {
			it('should show "View appeal details" when casePublishedDate is present', () => {
				appealCase.casePublishedDate = new Date();
				const section = findSectionByHeading(rule6Sections, 'Appeal details');
				const link = findLinkByUrl(section, '/appeal-details');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View appeal details');
			});

			it('should show "View appeal details" when casePublishedDate is present', () => {
				appealCase.casePublishedDate = null;
				const section = findSectionByHeading(rule6Sections, 'Appeal details');
				const link = findLinkByUrl(section, '/appeal-details');
				expect(link?.condition(appealCase)).toBe(false);
				expect(link?.text).toBe('View appeal details');
			});
		});

		describe('Questionnaire', () => {
			it('should show "View questionnaire" when lpaQuestionnairePublishedDate is present', () => {
				appealCase.lpaQuestionnairePublishedDate = '2023-09-02';
				const section = findSectionByHeading(rule6Sections, 'Questionnaire');
				const link = findLinkByUrl(section, '/questionnaire');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View questionnaire');
			});

			it('should not show "View questionnaire" when lpaQuestionnairePublishedDate is absent', () => {
				const section = findSectionByHeading(rule6Sections, 'Questionnaire');
				const link = findLinkByUrl(section, '/questionnaire');
				expect(link.condition(appealCase)).toBe(false);
			});
		});

		describe('Statements', () => {
			it('should show "View your statement" when rule 6s own statement is submitted', () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.RULE_6_PARTY,
						userOwnsRepresentation: true,
						representationType: REPRESENTATION_TYPES.STATEMENT
					}
				];
				const section = findSectionByHeading(rule6Sections, 'Statements');
				const link = findLinkByUrl(section, '/statement');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your statement');
			});

			it('should show "View your statement" when rule 6s own statement is not submitted', () => {
				const section = findSectionByHeading(rule6Sections, 'Statements');
				const link = findLinkByUrl(section, '/statement');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it('should show "View local planning authority statement" when lpa Statement is published', () => {
				appealCase.Representations = [
					{
						submittingPartyType: LPA_USER_ROLE,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.STATEMENT
					}
				];
				const section = findSectionByHeading(rule6Sections, 'Statements');
				const link = findLinkByUrl(section, '/lpa-statement');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View local planning authority statement');
			});

			it('should not show "View local planning authority statement" when lpa Statement is not published', () => {
				const section = findSectionByHeading(rule6Sections, 'Statements');
				const link = findLinkByUrl(section, '/lpa-statement');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it('should show "View other party statements" when any other statement is published', () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.RULE_6_PARTY,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.STATEMENT
					}
				];
				const section = findSectionByHeading(rule6Sections, 'Statements');
				const link = findLinkByUrl(section, '/other-party-statements');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View other party statements');
			});

			it('should not show "View other party statements" when no other statement is published', () => {
				const section = findSectionByHeading(rule6Sections, 'Statements');
				const link = findLinkByUrl(section, '/other-party-statements');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Interested party comments', () => {
			it('should show "View interested party comments" when any IP comment is published', () => {
				appealCase.Representations = [
					{
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
					}
				];
				const section = findSectionByHeading(rule6Sections, 'Interested party comments');
				const link = findLinkByUrl(section, '/interested-party-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View interested party comments');
			});

			it('should not show "View interested party comments" when no IP comments are published', () => {
				const section = findSectionByHeading(rule6Sections, 'Interested party comments');
				const link = findLinkByUrl(section, '/interested-party-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Planning obligation', () => {
			it('should show "View planning obligation" when statusPlanningObligation is set', () => {
				appealCase.statusPlanningObligation = 'finalised';
				appealCase.casePublishedDate = new Date();
				const section = findSectionByHeading(rule6Sections, 'Planning obligation');
				const link = findLinkByUrl(section, '/planning-obligation');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View the appellant’s planning obligation');
			});

			it('should not show "View planning obligation" when statusPlanningObligation is absent', () => {
				appealCase.statusPlanningObligation = null;
				appealCase.casePublishedDate = new Date();
				const section = findSectionByHeading(rule6Sections, 'Planning obligation');
				const link = findLinkByUrl(section, '/planning-obligation');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it('should not show "View planning obligation" when casePublishedDate is absent', () => {
				appealCase.statusPlanningObligation = 'finalised';
				appealCase.casePublishedDate = null;
				const section = findSectionByHeading(rule6Sections, 'Planning obligation');
				const link = findLinkByUrl(section, '/planning-obligation');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Final comments', () => {
			it('should show "View appellant\'s final comments" when appellant comment is published', () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.APPELLANT,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.FINAL_COMMENT
					}
				];
				const section = findSectionByHeading(rule6Sections, 'Final comments');
				const link = findLinkByUrl(section, '/appellant-final-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe("View appellant's final comments");
			});

			it('should not show "View appellant\'s final comments" when appellant comment is published', () => {
				const section = findSectionByHeading(rule6Sections, 'Final comments');
				const link = findLinkByUrl(section, '/appellant-final-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it('should show "View local planning authority final comments" when lpaFinalCommentsPublished is true', () => {
				appealCase.Representations = [
					{
						submittingPartyType: LPA_USER_ROLE,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.FINAL_COMMENT
					}
				];
				const section = findSectionByHeading(rule6Sections, 'Final comments');
				const link = findLinkByUrl(section, '/lpa-final-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View local planning authority final comments');
			});

			it('should not show "View local planning authority final comments" when lpaFinalCommentsPublished is absent', () => {
				const section = findSectionByHeading(rule6Sections, 'Final comments');
				const link = findLinkByUrl(section, '/lpa-final-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});

		describe('Proof of evidence and witnesses', () => {
			it('should show "View your proof of evidence and witnesses" when own proofs are submitted', () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.RULE_6_PARTY,
						userOwnsRepresentation: true,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(rule6Sections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your proof of evidence and witnesses');
			});

			it('should not show "View your proof of evidence and witnesses" when own proofs are not submitted', () => {
				const section = findSectionByHeading(rule6Sections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it("should show 'View the appellant's proof of evidence and witnesses' when appellant proof is published", () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.APPELLANT,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/appellant-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe("View the appellant's proof of evidence and witnesses");
			});

			it("should not show 'View the appellant's proof of evidence and witnesses' when appellant proof is not published", () => {
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/appellant-proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it("should show 'View the local planning authority proof of evidence and witnesses' when lpa proofs are published", () => {
				appealCase.Representations = [
					{
						submittingPartyType: LPA_USER_ROLE,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(rule6Sections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/lpa-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe(
					'View the local planning authority proof of evidence and witnesses'
				);
			});

			it("should not show 'View the local planning authority proof of evidence and witnesses' when lpa proofs are not published", () => {
				appealCase.lpaProofEvidencePublished = null;
				const section = findSectionByHeading(rule6Sections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/lpa-proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});

			it("should show 'View proof of evidence and witnesses from other parties' when any other rule 6 proofs are published", () => {
				appealCase.Representations = [
					{
						submittingPartyType: APPEAL_USER_ROLES.RULE_6_PARTY,
						representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
						userOwnsRepresentation: false,
						representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
					}
				];
				const section = findSectionByHeading(rule6Sections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/other-party-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View proof of evidence and witnesses from other parties');
			});

			it("should not show 'View proof of evidence and witnesses from other parties' when no other rule 6 proofs are published", () => {
				const section = findSectionByHeading(rule6Sections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/other-party-proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});
	});
});
