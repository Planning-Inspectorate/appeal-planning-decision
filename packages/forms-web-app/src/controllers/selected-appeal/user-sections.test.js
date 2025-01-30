const lpaSections = require('./lpa-user-sections').sections;
const appellantSections = require('./appellant-sections').sections;
describe('LPA and Appellant Sections', () => {
	let appealCase;
	beforeEach(() => {
		appealCase = {
			caseValidDate: '2023-09-01',
			lpaQuestionnaireSubmittedDate: null,
			lpaQuestionnairePublishedDate: null,
			lpaStatementPublished: true,
			rule6StatementPublished: true,
			interestedPartyCommentsPublished: true,
			planningObligation: true,
			lpaFinalCommentsPublished: true,
			appellantFinalCommentsSubmitted: true,
			lpaProofEvidencePublished: true,
			appellantProofEvidencePublished: true,
			rule6ProofsEvidencePublished: true
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
			it('should show "View your statement" when lpaStatementPublished is true', () => {
				const section = findSectionByHeading(lpaSections, 'Statements');
				const link = findLinkByUrl(section, '/statement');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your statement');
			});
			it('should not show "View your statement" when lpaStatementPublished is absent', () => {
				appealCase.lpaStatementPublished = null;
				const section = findSectionByHeading(lpaSections, 'Statements');
				const link = findLinkByUrl(section, '/statement');
				expect(link?.condition(appealCase)).toBe(false);
			});
			it('should show "View other party statements" when rule6StatementPublished is true', () => {
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
				const section = findSectionByHeading(lpaSections, 'Interested party comments');
				const link = findLinkByUrl(section, '/interested-party-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View interested party comments');
			});
			it('should not show "View interested party comments" when interestedPartyCommentsPublished is absent', () => {
				appealCase.interestedPartyCommentsPublished = null;
				const section = findSectionByHeading(lpaSections, 'Interested party comments');
				const link = findLinkByUrl(section, '/interested-party-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});
		describe('Planning obligation', () => {
			it('should show "View the appellant’s planning obligation" when planningObligation is true', () => {
				const section = findSectionByHeading(lpaSections, 'Planning obligation');
				const link = findLinkByUrl(section, '/appellant-planning-obligation');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View the appellant’s planning obligation');
			});
			it('should not show "View the appellant’s planning obligation" when planningObligation is absent', () => {
				appealCase.planningObligation = null;
				const section = findSectionByHeading(lpaSections, 'Planning obligation');
				const link = findLinkByUrl(section, '/appellant-planning-obligation');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});
		describe('Final comments', () => {
			it('should show "View your final comments" when lpaFinalCommentsPublished is true', () => {
				const section = findSectionByHeading(lpaSections, 'Final comments');
				const link = findLinkByUrl(section, '/final-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your final comments');
			});
			it('should not show "View your final comments" when lpaFinalCommentsPublished is absent', () => {
				appealCase.lpaFinalCommentsPublished = null;
				const section = findSectionByHeading(lpaSections, 'Final comments');
				const link = findLinkByUrl(section, '/final-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
			it('should show "View appellant final comments" when appellantFinalCommentsSubmitted is true', () => {
				const section = findSectionByHeading(lpaSections, 'Final comments');
				const link = findLinkByUrl(section, '/appellant-final-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View appellant final comments');
			});
			it('should not show "View appellant final comments" when appellantFinalCommentsSubmitted is absent', () => {
				appealCase.appellantFinalCommentsSubmitted = null;
				const section = findSectionByHeading(lpaSections, 'Final comments');
				const link = findLinkByUrl(section, '/appellant-final-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});
		describe('Proof of evidence and witnesses', () => {
			it('should show "View your proof of evidence and witnesses" when lpaProofEvidencePublished is true', () => {
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your proof of evidence and witnesses');
			});
			it('should not show "View your proof of evidence and witnesses" when lpaProofEvidencePublished is absent', () => {
				appealCase.lpaProofEvidencePublished = null;
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});
			it("should show 'View the appellant's proof of evidence and witnesses' when appellantProofEvidencePublished is true", () => {
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/appellant-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe("View the appellant's proof of evidence and witnesses");
			});
			it("should not show 'View the appellant's proof of evidence and witnesses' when appellantProofEvidencePublished is absent", () => {
				appealCase.appellantProofEvidencePublished = null;
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/appellant-proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});
			it("should show 'View proof of evidence and witnesses from other parties' when rule6ProofsEvidencePublished is true", () => {
				const section = findSectionByHeading(lpaSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/other-party-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View proof of evidence and witnesses from other parties');
			});
			it("should not show 'View proof of evidence and witnesses from other parties' when rule6ProofsEvidencePublished is absent", () => {
				appealCase.rule6ProofsEvidencePublished = null;
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
			it('should show "View local planning authority statement" when lpaStatementPublished is true', () => {
				const section = findSectionByHeading(appellantSections, 'Statements');
				const link = findLinkByUrl(section, '/lpa-statement');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View local planning authority statement');
			});
			it('should not show "View local planning authority statement" when lpaStatementPublished is absent', () => {
				appealCase.lpaStatementPublished = null;
				const section = findSectionByHeading(appellantSections, 'Statements');
				const link = findLinkByUrl(section, '/lpa-statement');
				expect(link?.condition(appealCase)).toBe(false);
			});
			it('should show "View other party statements" when rule6StatementPublished is true', () => {
				const section = findSectionByHeading(appellantSections, 'Statements');
				const link = findLinkByUrl(section, '/other-party-statements');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View other party statements');
			});
			it('should not show "View other party statements" when rule6StatementPublished is absent', () => {
				appealCase.rule6StatementPublished = null;
				const section = findSectionByHeading(appellantSections, 'Statements');
				const link = findLinkByUrl(section, '/other-party-statements');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});
		describe('Interested party comments', () => {
			it('should show "View interested party comments" when interestedPartyCommentsPublished is true', () => {
				const section = findSectionByHeading(appellantSections, 'Interested party comments');
				const link = findLinkByUrl(section, '/interested-party-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View interested party comments');
			});
			it('should not show "View interested party comments" when interestedPartyCommentsPublished is absent', () => {
				appealCase.interestedPartyCommentsPublished = null;
				const section = findSectionByHeading(appellantSections, 'Interested party comments');
				const link = findLinkByUrl(section, '/interested-party-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});
		describe('Planning obligation', () => {
			it('should show "View planning obligation" when planningObligation is true', () => {
				const section = findSectionByHeading(appellantSections, 'Planning obligation');
				const link = findLinkByUrl(section, '/planning-obligation');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View planning obligation');
			});
			it('should not show "View planning obligation" when planningObligation is absent', () => {
				appealCase.planningObligation = null;
				const section = findSectionByHeading(appellantSections, 'Planning obligation');
				const link = findLinkByUrl(section, '/planning-obligation');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});
		describe('Final comments', () => {
			it('should show "View your final comments" when appellantFinalCommentsSubmitted is true', () => {
				const section = findSectionByHeading(appellantSections, 'Final comments');
				const link = findLinkByUrl(section, '/final-comments');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your final comments');
			});
			it('should not show "View your final comments" when appellantFinalCommentsSubmitted is absent', () => {
				appealCase.appellantFinalCommentsSubmitted = null;
				const section = findSectionByHeading(appellantSections, 'Final comments');
				const link = findLinkByUrl(section, '/final-comments');
				expect(link?.condition(appealCase)).toBe(false);
			});
			it('should show "View local planning authority final comments" when lpaFinalCommentsPublished is true', () => {
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
			it('should show "View your proof of evidence and witnesses" when appellantProofEvidencePublished is true', () => {
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View your proof of evidence and witnesses');
			});
			it('should not show "View your proof of evidence and witnesses" when appellantProofEvidencePublished is absent', () => {
				appealCase.appellantProofEvidencePublished = null;
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});
			it("should show 'View the local planning authority proof of evidence and witnesses' when lpaProofEvidencePublished is true", () => {
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/lpa-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe(
					'View the local planning authority proof of evidence and witnesses'
				);
			});
			it("should not show 'View the local planning authority proof of evidence and witnesses' when lpaProofEvidencePublished is absent", () => {
				appealCase.lpaProofEvidencePublished = null;
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/lpa-proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});
			it("should show 'View other party proof of evidence and witnesses' when rule6ProofsEvidencePublished is true", () => {
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/other-party-proof-evidence');
				expect(link?.condition(appealCase)).toBe(true);
				expect(link?.text).toBe('View other party proof of evidence and witnesses');
			});
			it("should not show 'View proof of evidence and witnesses from other parties' when rule6ProofsEvidencePublished is absent", () => {
				appealCase.rule6ProofsEvidencePublished = null;
				const section = findSectionByHeading(appellantSections, 'Proof of evidence and witnesses');
				const link = findLinkByUrl(section, '/other-party-proof-evidence');
				expect(link?.condition(appealCase)).toBe(false);
			});
		});
	});
});
