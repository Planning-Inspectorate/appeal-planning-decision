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

## Site access

- radio `/inspector-access-appeal-site/` Will the inspector need access to the appellant’s land or property?
- radio `/inspector-enter-neighbour-site/` Will the inspector need to enter a neighbour’s land or property?
- list-add-more `/neighbour-address/` Do you want to add another neighbour to be visited?

```js
condition: () => questionHasAnswer(response, questions.neighbouringSite, 'yes');
```

- radio `/potential-safety-risks/` Add potential safety risks

## Appeal process

- radio `/procedure-type/` Which procedure do you think is most appropriate for this appeal?
- text-entry `/lpaPreferInquiryDetails/` Why would you prefer an inquiry?

```js
condition: () =>
	questionHasAnswer(response, questions.procedureType, APPEAL_CASE_PROCEDURE.INQUIRY);
```

- text-entry `/lpaPreferHearingDetails/` Why would you prefer a hearing?

```js
condition: () =>
	questionHasAnswer(response, questions.procedureType, APPEAL_CASE_PROCEDURE.HEARING);
```

- boolean `/ongoing-appeals/` Are there any other ongoing appeals next to, or close to the site?
- list-add-more `/appeal-reference-number/` Add another appeal?

```js
condition: () => questionHasAnswer(response, questions.appealsNearSite, 'yes');
```
