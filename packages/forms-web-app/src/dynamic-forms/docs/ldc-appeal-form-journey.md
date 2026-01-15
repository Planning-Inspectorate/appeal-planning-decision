# ldc-appeal-form

## Prepare appeal

- boolean `/application-name/` Was the application made in your name?
- multi-field-input `/applicant-name/` What is the applicant's name?

```js
condition: () => questionHasAnswer(response, questions.applicationName, 'no');
```

- multi-field-input `/contact-details/` Contact details
- single-line-input `/phone-number/` What is your phone number?
- address-entry `/appeal-site-address/` What is the address of the appeal site?

```js
condition: () => !shouldDisplayGridReference(response, config);
```

- multi-field-input `/grid-reference/` Enter the grid reference

```js
condition: () => shouldDisplayGridReference(response, config);
```

- boolean `/green-belt/` Is the appeal site in a green belt?
- radio `/inspector-need-access/` Will an inspector need to access your land or property?
- radio `/health-safety-issues/` Health and safety issues
- single-line-input `/reference-number/` What is the application reference number?
- date `/application-date/` What date did you submit your application?
- text-entry `/existing-use/` What did you use the appeal site for when you made the application?
- radio `/lawful-development-certificate-type/` What type of lawful development certificate is the appeal about?

- Multiquestion condition started: ldc-about

```js
condition: () =>
	questionsHaveAnswers(
		response,
		[
			[
				questions.lawfulDevelopmentCertificateType,
				fieldValues.lawfulDevelopmentCertificateType.PROPOSED_USE_DEVELOPMENT
			],
			[
				questions.lawfulDevelopmentCertificateType,
				fieldValues.lawfulDevelopmentCertificateType.PROPOSED_CHANGES_LISTED_BUILDING
			]
		],
		{ logicalCombinator: 'or' }
	);
```

- text-entry `/enter-description-of-development/` Enter the description of development that you submitted in your application
- boolean `/description-development-correct/` Did the local planning authority change the description of development?

- Multiquestion condition ended: ldc-about

- radio `/decide-appeal/` How would you prefer us to decide your appeal?
- text-entry `/why-prefer-hearing/` Why would you prefer a hearing?

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.appellantProcedurePreference,
		APPEAL_CASE_PROCEDURE.HEARING
	);
```

- text-entry `/why-prefer-inquiry/` Why would you prefer an inquiry?

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.appellantProcedurePreference,
		APPEAL_CASE_PROCEDURE.INQUIRY
	);
```

- number-entry `/how-many-days-inquiry/` How many days would you expect the inquiry to last?

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.appellantProcedurePreference,
		APPEAL_CASE_PROCEDURE.INQUIRY
	) && questionHasNonEmptyStringAnswer(response, questions.appellantPreferInquiry);
```

- number-entry `/how-many-witnesses/` How many witnesses would you expect to give evidence at the inquiry?

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.appellantProcedurePreference,
		APPEAL_CASE_PROCEDURE.INQUIRY
	) &&
	questionHasNonEmptyStringAnswer(response, questions.appellantPreferInquiry) &&
	questionHasNonEmptyNumberAnswer(response, questions.inquiryHowManyDays);
```

- boolean `/other-appeals/` Are there other appeals linked to your development?
- list-add-more `/enter-appeal-reference/` Add another appeal?

```js
condition: () => questionHasAnswer(response, questions.anyOtherAppeals, 'yes');
```

## Upload documents

- multi-file-upload `/upload-application-form/` Upload your application form
- multi-file-upload `/upload-description-evidence/` Upload evidence of your agreement to change the description of development

```js
condition: () => questionHasAnswer(response, questions.updateDevelopmentDescription, 'yes');
```

- multi-file-upload `/upload-decision-letter/` Upload the decision letter from the local planning authority

```js
condition: () => shouldDisplayUploadDecisionLetter(response);
```

- boolean `/submit-planning-obligation/` Do you plan to submit a planning obligation to support your appeal?
- radio `/status-planning-obligation/` What is the status of your planning obligation?

```js
condition: () => questionHasAnswer(response, questions.submitPlanningObligation, 'yes');
```

- multi-file-upload `/upload-planning-obligation/` Upload your planning obligation

```js
condition: () =>
	questionsHaveAnswers(
		response,
		[
			[questions.submitPlanningObligation, 'yes'],
			[questions.planningObligationStatus, 'finalised']
		],
		{ logicalCombinator: 'and' }
	);
```

- multi-file-upload `/upload-appeal-statement/` Upload your appeal statement
- multi-file-upload `/upload-draft-statement-common-ground/` Upload your draft statement of common ground

```js
condition: () =>
	questionsHaveAnswers(
		response,
		[
			[questions.appellantProcedurePreference, APPEAL_CASE_PROCEDURE.HEARING],
			[questions.appellantProcedurePreference, APPEAL_CASE_PROCEDURE.INQUIRY]
		],
		{ logicalCombinator: 'or' }
	);
```

- boolean `/apply-appeal-costs/` Do you want to apply for an award of appeal costs?
- multi-file-upload `/upload-appeal-costs-application/` Upload your application for an award of appeal costs

```js
condition: () => questionHasAnswer(response, questions.costApplication, 'yes');
```

- multi-file-upload `/upload-plans-drawings-documents/` Upload your plans, drawings and supporting documents you submitted with your application
- boolean `/new-plans-drawings/` Do you have any new plans or drawings that support your appeal?
- multi-file-upload `/upload-new-plans-drawings/` Upload your new plans or drawings

```js
condition: () => questionHasAnswer(response, questions.newPlansDrawings, 'yes');
```

- boolean `/other-new-documents/` Do you have any other new documents that support your appeal?
- multi-file-upload `/upload-other-new-supporting-documents/` Upload your other new supporting documents

```js
condition: () => questionHasAnswer(response, questions.otherNewDocuments, 'yes');
```
