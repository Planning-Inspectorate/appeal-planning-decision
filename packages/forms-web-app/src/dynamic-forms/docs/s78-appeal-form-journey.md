# s78-appeal-form

## Prepare appeal

- boolean `/application-name/` Was the application made in your name?
- multi-field-input `/applicant-name/` What is the applicant's name?

```js
condition: () => questionHasAnswer(response, questions.applicationName, 'no');
```

- multi-field-input `/contact-details/` Contact details
- single-line-input `/phone-number/` What is your phone number?
- address-entry `/appeal-site-address/` What is the address of the appeal site?
- unit-option-entry `/site-area/` What is the area of the appeal site?
- boolean `/green-belt/` Is the appeal site in a green belt?
- boolean `/own-all-land/` Do you own all of the land involved in the appeal?
- boolean `/own-some-land/` Do you own some of the land involved in the appeal?

```js
condition: () => questionHasAnswer(response, questions.ownsAllLand, 'no');
```

- radio `/owns-rest-of-land/` Do you know who owns the rest of the land involved in the appeal?

```js
condition: () =>
	questionsHaveAnswers(
		response,
		[
			[questions.ownsSomeLand, 'yes'],
			[questions.ownsAllLand, 'no']
		],
		{ logicalCombinator: 'and' }
	);
```

- radio `/owns-land-involved/` Do you know who owns the land involved in the appeal?

```js
condition: () =>
	questionsHaveAnswers(
		response,
		[
			[questions.ownsSomeLand, 'no'],
			[questions.ownsAllLand, 'no']
		],
		{ logicalCombinator: 'and' }
	);
```

- boolean `/identifying-landowners/` Identifying the landowners

```js
condition: () =>
	shouldDisplayIdentifyingLandowners(response, questions) &&
	questionHasAnswer(response, questions.ownsAllLand, 'no');
```

- boolean `/advertising-appeal/` Advertising your appeal

```js
condition: () =>
	shouldDisplayIdentifyingLandowners(response, questions) &&
	questionHasAnswer(response, questions.identifyingLandowners, 'yes');
```

- boolean `/telling-landowners/` Telling the landowners

```js
condition: () =>
	shouldDisplayTellingLandowners(response, questions) &&
	questionHasAnswer(response, questions.ownsAllLand, 'no');
```

- boolean `/agricultural-holding/` Is the appeal site part of an agricultural holding?
- boolean `/tenant-agricultural-holding/` Are you a tenant of the agricultural holding?

```js
condition: () => questionHasAnswer(response, questions.agriculturalHolding, 'yes');
```

- boolean `/other-tenants/` Are there any other tenants?

```js
condition: () =>
	questionsHaveAnswers(
		response,
		[
			[questions.agriculturalHolding, 'yes'],
			[questions.tenantAgriculturalHolding, 'yes']
		],
		{ logicalCombinator: 'and' }
	);
```

- boolean `/telling-tenants/` Telling the tenants

```js
condition: () => shouldDisplayTellingTenants(response, questions);
```

- radio `/inspector-need-access/` Will an inspector need to access your land or property?
- radio `/health-safety-issues/` Health and safety issues
- single-line-input `/reference-number/` What is the application reference number?
- date `/application-date/` What date did you submit your application?
- radio `/major-minor-development/` Was your application for a major or minor development?
- radio `/application-about/` Was your application about any of the following?
- text-entry `/enter-description-of-development/` Enter the description of development that you submitted in your application
- boolean `/description-development-correct/` Did the local planning authority change the description of development?
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
condition: (response) => {
	return response.answers.applicationDecision !== APPLICATION_DECISION.NODECISIONRECEIVED;
};
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

- boolean `/separate-ownership-certificate/` Did you submit a separate ownership certificate and agricultural land declaration with your application?
- multi-file-upload `/upload-certificate-declaration/` Upload your separate ownership certificate and agricultural land declaration

```js
condition: () => questionHasAnswer(response, questions.separateOwnershipCert, 'yes');
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

- boolean `/submit-design-access-statement/` Did you submit a design and access statement with your application?
- multi-file-upload `/upload-design-access-statement/` Upload your design and access statement

```js
condition: () => questionHasAnswer(response, questions.designAccessStatement, 'yes');
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
