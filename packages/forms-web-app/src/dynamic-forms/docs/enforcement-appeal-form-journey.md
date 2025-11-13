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
