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
