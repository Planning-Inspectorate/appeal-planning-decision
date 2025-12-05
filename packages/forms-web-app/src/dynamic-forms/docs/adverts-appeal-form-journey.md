# adverts-appeal-form

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

- boolean `/highway-land/` Is the appeal site on highway land?
- boolean `/advertisement-position/` Is the advertisement in position?
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
condition: () => shouldDisplayIdentifyingLandowners(response, questions);
```

- boolean `/advertising-appeal/` Advertising your appeal

```js
condition: () =>
	shouldDisplayIdentifyingLandowners(response, questions) &&
	questionHasAnswer(response, questions.identifyingLandowners, 'yes');
```

- boolean `/telling-landowners/` Telling the landowners

```js
condition: () => shouldDisplayTellingLandowners(response, questions);
```

- boolean `/landowner-permission/` Do you have the landowner’s permission?

```js
condition: () => shouldDisplayTellingLandowners(response, questions);
```

- radio `/inspector-need-access/` Will an inspector need to access your land or property?
- radio `/health-safety-issues/` Health and safety issues
- single-line-input `/reference-number/` What is the application reference number?
- date `/application-date/` What date did you submit your application?
- text-entry `/description-advertisement/` Enter the description of the advertisement that you submitted in your application
- boolean `/description-advertisement-correct/` Did the local planning authority change the description of the advertisement?
- multi-file-upload `/upload-description-evidence/` Upload evidence of your agreement to change the description of the advertisement

```js
condition: () => questionHasAnswer(response, questions.updateAdvertisementDescription, 'yes');
```

- radio `/decide-appeal/` How would you prefer us to decide your appeal?

```js
condition: () => shouldDisplayAdvertsQuestions(response);
```

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
- multi-file-upload `/upload-decision-letter/` Upload the decision letter from the local planning authority

```js
condition: () => shouldDisplayUploadDecisionLetter(response);
```

- multi-file-upload `/upload-appeal-statement/` Upload your appeal statement
- boolean `/apply-appeal-costs/` Do you want to apply for an award of appeal costs?
- multi-file-upload `/upload-appeal-costs-application/` Upload your application for an award of appeal costs

```js
condition: () => questionHasAnswer(response, questions.costApplication, 'yes');
```

- multi-file-upload `/upload-plans-drawings-documents/` Upload your plans, drawings and supporting documents you submitted with your application
