# ldc-lpaq

## Constraints, designations and other issues

- boolean `/correct-appeal-type/` Is <appeal type with an or a> appeal the correct type of appeal?
- radio `/certificate-type/` What type of lawful development certificate is the appeal about?
- boolean `/planning-condition/` Does the appeal relate to a planning condition?
- multi-file-upload `/upload-relevant-planning-permission/` Upload a copy of the relevant planning permission

```js
condition: () => questionHasAnswer(response, questions.planningCondition, 'yes');
```

- boolean `/enforcement-notice-date-application/` Was there an enforcement notice in force at the date of the application?
- multi-file-upload `/upload-enforcement-notice/` Upload the enforcement notice

```js
condition: () => questionHasAnswer(response, questions.enforcementNoticeDateApplication, 'yes');
```

- boolean `/related-applications/` Are there any related applications?
- multi-file-upload `/upload-related-applications/` Upload related applications

```js
condition: () => questionHasAnswer(response, questions.relatedApplications, 'yes');
```

- radio `/appeal-invalid/` Do you think the appeal is invalid?
