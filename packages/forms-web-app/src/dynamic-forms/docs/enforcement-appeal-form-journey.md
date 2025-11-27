# enforcement-appeal-form

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
- single-line-input `/phone-number/` What is your phone number?
- address-entry `/appeal-site-address/` What is the address of the appeal site?
- boolean `/is-contact-address/` Is the appeal site address your contact address?
- address-entry `/contact-address/` What is your contact address?

```js
condition: () => questionHasAnswer(response, questions.appealSiteIsContactAddress, 'no');
```

- radio `/inspector-need-access/` Will an inspector need to access the land or property?
- radio `/health-safety-issues/` Health and safety issues
- text-entry `/description-alleged-breach/` Enter the description of the alleged breach
- boolean `/submit-planning-application/` Did anyone submit a planning application for the development on the enforcement notice and pay the correct fee?
- multi-file-upload `/upload-application-receipt/` Upload your application receipt

```js
condition: () => questionHasAnswer(response, questions.submittedPlanningApplication, 'yes');
```

- radio `/all-or-part/` Was the application for all or part of the development?
- single-line-input `/planning-application-number/` What is the application reference number?
- date `/application-date/` What date did you submit your application?
- text-entry `/enter-description-of-development/` Enter the description of development
- boolean `/description-development-correct/` Did the local planning authority change the description of development?
- radio `/granted-or-refused/` Was the application granted or refused?

## Upload documents

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

- boolean `/apply-appeal-costs/` Do you need to apply for an award of appeal costs?
- multi-file-upload `/upload-appeal-costs-application/` Upload your application for an award of appeal costs

```js
condition: () => questionHasAnswer(response, questions.costApplication, 'yes');
```

- boolean `/other-new-documents/` Do you have any other new documents that support your appeal?
- multi-file-upload `/upload-other-new-supporting-documents/` Upload your other new supporting documents

```js
condition: () => questionHasAnswer(response, questions.otherNewDocuments, 'yes');
```
