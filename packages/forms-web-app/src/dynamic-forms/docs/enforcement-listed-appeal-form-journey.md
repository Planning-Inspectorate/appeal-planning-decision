# enforcement-listed-appeal-form

## Prepare appeal

- radio `/who-is-appealing/` Who is appealing against the enforcement notice?
- multi-field-input `/individual-name/` What is the name of the individual appealing against the enforcement notice?

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.enforcementWhoIsAppealing,
		fieldValues.enforcementWhoIsAppealing.INDIVIDUAL
	);
```

- boolean `/are-you-individual/` Are you <individual name>?

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.enforcementWhoIsAppealing,
		fieldValues.enforcementWhoIsAppealing.INDIVIDUAL
	);
```

- list-add-more `/add-another-individual/` Do you need to add another individual?

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.enforcementWhoIsAppealing,
		fieldValues.enforcementWhoIsAppealing.GROUP
	);
```

- radio `/select-name/` Select your name

```js
condition: () =>
	questionHasAnswer(
		response,
		questions.enforcementWhoIsAppealing,
		fieldValues.enforcementWhoIsAppealing.GROUP
	);
```

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
condition: () => !questionHasAnswer(response, questions.enforcementAreYouIndividual, 'yes');
```

- single-line-input `/phone-number/` What is your phone number?
- content `/complete-appeal/` Complete the appeal on behalf of <dynamic named parties>

```js
condition: () => questionHasNonEmptyStringAnswer(response, questions.enforcementWhoIsAppealing);
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

- Multiquestion condition started: groundAPreviousApplication

```js
condition: (response) => {
	const baseSubmittedAppealGrounds = response.answers['SubmissionAppealGround'] || [];
	const submittedAppealGrounds = Array.isArray(baseSubmittedAppealGrounds)
		? baseSubmittedAppealGrounds
		: [baseSubmittedAppealGrounds];
	if (!submittedAppealGrounds.length) return false;
	return submittedAppealGrounds.some((ground) => ground.groundName === 'a');
};
```

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

- text-entry `/facts-ground-h/` Facts for ground (h)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-h-supporting-documents/` Do you have any documents to support your ground (h) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-h-supporting-documents/` Upload your ground (h) supporting documents

```js
condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`);
```

- text-entry `/facts-ground-i/` Facts for ground (i)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-i-supporting-documents/` Do you have any documents to support your ground (i) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-i-supporting-documents/` Upload your ground (i) supporting documents

```js
condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`);
```

- text-entry `/facts-ground-j/` Facts for ground (j)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-j-supporting-documents/` Do you have any documents to support your ground (j) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-j-supporting-documents/` Upload your ground (j) supporting documents

```js
condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`);
```

- text-entry `/facts-ground-k/` Facts for ground (k)

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- boolean `/facts-ground-k-supporting-documents/` Do you have any documents to support your ground (k) facts?

```js
condition: () => responseHasAppealGround(response, `${appealGround}`);
```

- multi-file-upload `/upload-facts-ground-k-supporting-documents/` Upload your ground (k) supporting documents

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
- multi-file-upload `/upload-enforcement-notice/` Upload your enforcement notice
- multi-file-upload `/upload-enforcement-plan/` Upload your enforcement notice plan
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
