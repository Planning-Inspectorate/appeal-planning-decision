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

## Planning officer's report and supporting documents

- boolean `/planning-officer-report/` Do you have a planning officer’s report?
- multi-file-upload `/upload-planning-officers-report-decision-notice/` Upload the planning officer’s report or what your decision notice would have said

```js
condition: () => questionHasAnswer(response, questions.planningOfficersReport, 'yes');
```

- boolean `/community-infrastructure-levy/` Do you have a community infrastructure levy?
- multi-file-upload `/upload-community-infrastructure-levy/` Upload your community infrastructure levy

```js
condition: () => questionHasAnswer(response, questions.communityInfrastructureLevy, 'yes');
```

- boolean `/community-infrastructure-levy-adopted/` Is the community infrastructure levy formally adopted?

```js
condition: () => questionHasAnswer(response, questions.communityInfrastructureLevy, 'yes');
```

- date `/infrastructureLevyAdoptedDate/` When was the community infrastructure levy formally adopted?

```js
condition: () =>
	questionsHaveAnswers(response, [
		[questions.communityInfrastructureLevy, 'yes'],
		[questions.communityInfrastructureLevyAdopted, 'yes']
	]);
```

- date `/infrastructureLevyExpectedDate/` When do you expect to formally adopt the community infrastructure levy?

```js
condition: () =>
	questionsHaveAnswers(response, [
		[questions.communityInfrastructureLevy, 'yes'],
		[questions.communityInfrastructureLevyAdopted, 'no']
	]);
```

- boolean `/other-relevant-matters/` Are there any other relevant matters?
- multi-file-upload `/upload-other-relevant-matters/` Upload other relevant matters

```js
condition: () => questionHasAnswer(response, questions.otherRelevantMatters, 'yes');
```

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
