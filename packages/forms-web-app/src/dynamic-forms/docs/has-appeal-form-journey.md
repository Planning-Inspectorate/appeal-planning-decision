# has-appeal-form

## Prepare appeal

- boolean `/application-name/` Was the application made in your name?
- multi-field-input `/applicant-name/` What is the applicant's name?

```js
condition: (response) => questionHasAnswer(response, questions.applicationName, 'no');
```

- multi-field-input `/contact-details/` Contact details
- single-line-input `/phone-number/` What is your phone number?
- address-entry `/appeal-site-address/` What is the address of the appeal site?
- number-entry `/site-area/` What is the area of the appeal site?
- boolean `/green-belt/` Is the appeal site in a green belt?
- boolean `/own-all-land/` Do you own all of the land involved in the appeal?
- boolean `/own-some-land/` Do you own some of the land involved in the appeal?

```js
condition: (response) => questionHasAnswer(response, questions.ownsAllLand, 'no');
```

- radio `/owns-rest-of-land/` Do you know who owns the rest of the land involved in the appeal?

```js
condition: (response) =>
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
condition: (response) =>
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
condition: (response) => shouldDisplayIdentifyingLandowners(response, questions);
```

- boolean `/advertising-appeal/` Advertising your appeal

```js
condition: (response) =>
	shouldDisplayIdentifyingLandowners(response, questions) &&
	questionHasAnswer(response, questions.identifyingLandowners, 'yes');
```

- boolean `/telling-landowners/` Telling the landowners

```js
condition: (response) => shouldDisplayTellingLandowners(response, questions);
```

- radio `/inspector-need-access/` Will an inspector need to access your land or property?
- radio `/health-safety-issues/` Health and safety issues
- single-line-input `/reference-number/` What is the application reference number?
- date `/application-date/` What date did you submit your application?
- text-entry `/enter-description-of-development/` Enter the description of development that you submitted in your application
- boolean `/description-development-correct/` Did the local planning authority change the description of development?
- boolean `/other-appeals/` Are there other appeals linked to your development?
- list-add-more `/enter-appeal-reference/` Add another appeal?

```js
condition: (response) => questionHasAnswer(response, questions.anyOtherAppeals, 'yes');
```

## Upload documents

- multi-file-upload `/upload-application-form/` Upload your application form
- multi-file-upload `/upload-description-evidence/` Upload evidence of your agreement to change the description of development

```js
condition: (response) => questionHasAnswer(response, questions.updateDevelopmentDescription, 'yes');
```

- multi-file-upload `/upload-decision-letter/` Upload the decision letter from the local planning authority
- multi-file-upload `/upload-appeal-statement/` Upload your appeal statement
- boolean `/apply-appeal-costs/` Do you need to apply for an award of appeal costs?
- multi-file-upload `/upload-appeal-costs-application/` Upload your application for an award of appeal costs

```js
condition: (response) => questionHasAnswer(response, questions.costApplication, 'yes');
```
