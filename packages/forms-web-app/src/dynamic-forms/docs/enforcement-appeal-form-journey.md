# enforcement-appeal-form

## Prepare appeal

- radio `/who-is-appealing/` Who is appealing against the enforcement notice?

- Multiquestion condition started: individual appellant

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.enforcementWhoIsAppealing,
		fieldValues.enforcementWhoIsAppealing.INDIVIDUAL
	);
```

- multi-field-input `/individual-name/` What is the name of the individual appealing against the enforcement notice?
- boolean `/are-you-individual/` Are you <individual name>?

```js
condition: () => questionHasNonEmptyStringAnswer(response, { fieldName: 'appellantFirstName' });
```

- Multiquestion condition started: group of appellants

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.enforcementWhoIsAppealing,
		fieldValues.enforcementWhoIsAppealing.GROUP
	);
```

- list-add-more `/add-another-individual/` Do you need to add another individual?
- radio `/select-name/` Select your name

- Multiquestion condition ended: group of appellants

- single-line-input `/organisation-name/` What is the name of the organisation?

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.enforcementWhoIsAppealing,
		fieldValues.enforcementWhoIsAppealing.ORGANISATION
	);
```

- multi-field-input `/contact-details/` Contact details

```js
condition: () => shouldDisplayEnforcementContactDetails(response, questions);
```

- single-line-input `/phone-number/` What is your phone number?
- content `/complete-appeal/` Complete the appeal on behalf of <dynamic named parties>

```js
condition: () => shouldDisplayEnforcementCompleteOnBehalfOf(response, questions);
```

- address-entry `/appeal-site-address/` What is the address of the appeal site?
- boolean `/is-contact-address/` Is the appeal site address your contact address?
- address-entry `/contact-address/` What is your contact address?

```js
condition: () => questionHasAnswer(response, questions.appealSiteIsContactAddress, 'no');
```

- radio `/inspector-need-access/` Will an inspector need to access the land or property?
- radio `/health-safety-issues/` Health and safety issues
- text-entry `/description-alleged-breach/` Enter the description of the alleged breach
- checkbox `/choose-grounds/` Choose your grounds of appeal
- boolean `/submit-planning-application/` Did anyone submit a planning application for the development on the enforcement notice and pay the correct fee?

```js
condition: () => responseHasAppealGround(response, 'a');
```

- Multiquestion condition started: groundAPreviousApplication

```js
condition: () => shouldDisplayPreviousApplicationQuestions(response, questions);
```

- radio `/all-or-part/` Was the application for all or part of the development?
- single-line-input `/planning-application-number/` What is the application reference number?
- date `/application-date/` What date did you submit your application?
- text-entry `/enter-description-of-development/` Enter the description of development
- boolean `/description-development-correct/` Did the local planning authority change the description of development?
- radio `/granted-or-refused/` Was the application granted or refused?
- date `/decision-date/` What is the date on the decision letter from the local planning authority?

```js
condition: () =>
	questionHasAnswer(response, questions.grantedOrRefused, 'granted') ||
	questionHasAnswer(response, questions.grantedOrRefused, 'refused');
```

- boolean `/did-anyone-appeal/` Did anyone appeal the decision?

```js
condition: () =>
	questionHasAnswer(response, questions.grantedOrRefused, 'granted') ||
	questionHasAnswer(response, questions.grantedOrRefused, 'refused');
```

- date `/appeal-decision-date/` When was the appeal decision?

```js
condition: () => questionHasAnswer(response, questions.applicationDecisionAppealed, 'yes');
```

- date `/decision-date-due/` What date was your decision due?

```js
condition: () => questionHasAnswer(response, questions.grantedOrRefused, 'nodecisionreceived');
```

- Multiquestion condition ended: groundAPreviousApplication

- text-entry `/facts-ground-a/` Facts for ground (a)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-a-supporting-documents/` Do you have any documents to support your ground (a) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-a-supporting-documents/` Upload your ground (a) supporting documents

```js
condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`);
```

- text-entry `/facts-ground-b/` Facts for ground (b)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-b-supporting-documents/` Do you have any documents to support your ground (b) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-b-supporting-documents/` Upload your ground (b) supporting documents

```js
condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`);
```

- text-entry `/facts-ground-c/` Facts for ground (c)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-c-supporting-documents/` Do you have any documents to support your ground (c) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-c-supporting-documents/` Upload your ground (c) supporting documents

```js
condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`);
```

- text-entry `/facts-ground-d/` Facts for ground (d)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-d-supporting-documents/` Do you have any documents to support your ground (d) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-d-supporting-documents/` Upload your ground (d) supporting documents

```js
condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`);
```

- text-entry `/facts-ground-e/` Facts for ground (e)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-e-supporting-documents/` Do you have any documents to support your ground (e) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-e-supporting-documents/` Upload your ground (e) supporting documents

```js
condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`);
```

- text-entry `/facts-ground-f/` Facts for ground (f)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-f-supporting-documents/` Do you have any documents to support your ground (f) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-f-supporting-documents/` Upload your ground (f) supporting documents

```js
condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`);
```

- text-entry `/facts-ground-g/` Facts for ground (g)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-g-supporting-documents/` Do you have any documents to support your ground (g) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-g-supporting-documents/` Upload your ground (g) supporting documents

```js
condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`);
```

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

- multi-file-upload `/upload-planning-inspectorate-communication/` Upload your communication with the Planning Inspectorate

```js
condition: () => shouldDisplayPriorCorrespondenceUpload(response);
```

- multi-file-upload `/upload-enforcement-notice/` Upload your enforcement notice
- multi-file-upload `/upload-enforcement-plan/` Upload your enforcement notice plan

- Multiquestion condition started: ground a supplementary documents

```js
condition: () => responseHasAppealGround(response, 'a');
```

- multi-file-upload `/upload-application-form/` Upload your application form

```js
condition: () => questionHasAnswer(response, questions.submittedPlanningApplication, 'yes');
```

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

- Multiquestion condition ended: ground a supplementary documents

- boolean `/apply-appeal-costs/` Do you want to apply for an award of appeal costs?
- multi-file-upload `/upload-appeal-costs-application/` Upload your application for an award of appeal costs

```js
condition: () => questionHasAnswer(response, questions.costApplication, 'yes');
```

- boolean `/other-new-documents/` Do you have any other new documents that support your appeal?
- multi-file-upload `/upload-other-new-supporting-documents/` Upload your other new supporting documents

```js
condition: () => questionHasAnswer(response, questions.otherNewDocuments, 'yes');
```
