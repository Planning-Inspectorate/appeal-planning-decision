# s20-lpaq

## Constraints, designations and other issues

- boolean `/correct-appeal-type/` Is <appeal type with an or a> appeal the correct type of appeal?
- boolean `/changes-listed-building/` Does the proposed development change a listed building?
- list-add-more `/changed-listed-buildings/` Add another building or site?

```js
condition: () => questionHasAnswer(response, questions.changesListedBuilding, 'yes');
```

- boolean `/affect-listed-building/` Does the proposed development affect the setting of listed buildings?
- list-add-more `/affected-listed-buildings/` Add another building or site?

```js
condition: () => questionHasAnswer(response, questions.listedBuildingCheck, 'yes');
```

- boolean `/preserve-grant-loan/` Was a grant or loan made to preserve the listed building at the appeal site?
- boolean `/consult-historic-england/` Did you consult Historic England?
- multi-file-upload `/historic-england-consultation/` Upload your consultation with Historic England

```js
condition: () => questionHasAnswer(response, questions.consultHistoricEngland, 'yes');
```

- boolean `/scheduled-monument/` Would the development affect a scheduled monument?
- boolean `/conservation-area/` Is the site in, or next to a conservation area?
- multi-file-upload `/upload-conservation-area-map-guidance/` Upload conservation map and guidance

```js
condition: () => questionHasAnswer(response, questions.conservationArea, 'yes');
```

- boolean `/protected-species/` Would the development affect a protected species?
- boolean `/green-belt/` Is the site in a green belt?
- boolean `/area-of-outstanding-natural-beauty/` Is the site in a national landscape?
- checkbox `/designated-sites/` Is the development in, near or likely to affect any designated sites?
- boolean `/tree-preservation-order/` Does a Tree Preservation Order (TPO) apply to any part of the appeal site?
- multi-file-upload `/upload-plan-showing-order/` Upload a plan showing the extent of the order

```js
condition: () => questionHasAnswer(response, questions.treePreservationOrder, 'yes');
```

- boolean `/gypsy-traveller/` Does the development relate to anyone claiming to be a Gypsy or Traveller?
- boolean `/public-right-of-way/` Would a public right of way need to be removed or diverted?
- multi-file-upload `/upload-definitive-map-statement/` Upload the definitive map and statement extract

```js
condition: () => questionHasAnswer(response, questions.rightOfWayCheck, 'yes');
```

## Environmental impact assessment

- radio `/schedule-1-or-2/` What is the development category?
- radio `/development-description/` Description of development

```js
condition: () => questionHasAnswer(response, questions.environmentalImpactSchedule, 'schedule-2');
```

- radio `/sensitive-area/` Is the development in, partly in, or likely to affect a sensitive area?

```js
condition: () => questionHasAnswer(response, questions.environmentalImpactSchedule, 'schedule-2');
```

- boolean `/column-2-threshold/` Does the development meet or exceed the threshold or criteria in column 2?

```js
condition: () => questionHasAnswer(response, questions.environmentalImpactSchedule, 'schedule-2');
```

- boolean `/screening-opinion/` Have you issued a screening opinion?

```js
condition: () =>
	questionsHaveAnswers(
		response,
		[
			[questions.environmentalImpactSchedule, 'schedule-2'],
			[questions.environmentalImpactSchedule, 'no']
		],
		{ logicalCombinator: 'or' }
	);
```

- multi-file-upload `/upload-screening-opinion/` Upload your screening opinion and any correspondence

```js
condition: () =>
	questionHasAnswer(response, questions.screeningOpinion, 'yes') &&
	questionsHaveAnswers(
		response,
		[
			[questions.environmentalImpactSchedule, 'schedule-2'],
			[questions.environmentalImpactSchedule, 'no']
		],
		{ logicalCombinator: 'or' }
	);
```

- boolean `/screening-opinion-environmental-statement/` Did your screening opinion say the development needed an environmental statement?

```js
condition: () =>
	questionHasAnswer(response, questions.screeningOpinion, 'yes') &&
	questionsHaveAnswers(
		response,
		[
			[questions.environmentalImpactSchedule, 'schedule-2'],
			[questions.environmentalImpactSchedule, 'no']
		],
		{ logicalCombinator: 'or' }
	);
```

- boolean `/scoping-opinion/` Did you receive a scoping opinion?

```js
condition: () =>
	questionsHaveAnswers(
		response,
		[
			[questions.screeningOpinion, 'yes'],
			[questions.screeningOpinionEnvironmentalStatement, 'yes']
		],
		{ logicalCombinator: 'and' }
	) && config.featureFlag.scopingOpinionEnabled;
```

- multi-file-upload `/upload-scoping-opinion/` Upload your scoping opinion

```js
condition: () =>
	questionsHaveAnswers(
		response,
		[
			[questions.scopingOpinion, 'yes'],
			[questions.screeningOpinion, 'yes'],
			[questions.screeningOpinionEnvironmentalStatement, 'yes']
		],
		{ logicalCombinator: 'and' }
	) && config.featureFlag.scopingOpinionEnabled;
```

- radio `/environmental-statement/` Did the applicant submit an environmental statement?
- multi-file-upload `/upload-environmental-statement/` Upload the environmental statement and supporting information

```js
condition: () => questionHasAnswer(response, questions.submitEnvironmentalStatement, 'yes');
```

- multi-file-upload `/upload-screening-direction/` Upload the screening direction

```js
condition: () =>
	questionsHaveAnswers(
		response,
		[
			[questions.submitEnvironmentalStatement, 'no'],
			[questions.environmentalImpactSchedule, 'schedule-2'],
			[questions.screeningOpinion, 'yes']
		],
		{ logicalCombinator: 'and' }
	);
```

## Notifying relevant parties

- multi-file-upload `/upload-who-you-notified/` Who did you notify about this application?
- checkbox `/notification-type/` How did you notify relevant parties about the planning application?
- multi-file-upload `/upload-site-notice/` Upload the site notice

```js
condition: () => questionHasAnswer(response, questions.howYouNotifiedPeople, 'site-notice');
```

- multi-file-upload `/letters-interested-parties/` Upload letters or emails sent to interested parties with their addresses

```js
condition: () => questionHasAnswer(response, questions.howYouNotifiedPeople, 'letters-or-emails');
```

- multi-file-upload `/upload-press-advert/` Upload the press advertisement

```js
condition: () => questionHasAnswer(response, questions.howYouNotifiedPeople, 'advert');
```

- multi-file-upload `/appeal-notification-letter/` Upload the appeal notification letter and the list of people that you notified

## Consultation responses and representations

- radio `/statutory-consultees/` Did you consult all the relevant statutory consultees about the development?
- boolean `/consultation-responses/` Do you have any consultation responses or standing advice from statutory consultees to upload?
- multi-file-upload `/upload-consultation-responses/` Upload the consultation responses and standing advice

```js
condition: () => questionHasAnswer(response, questions.consultationResponses, 'yes');
```

- boolean `/representations/` Did you receive representations from members of the public or other parties?
- multi-file-upload `/upload-representations/` Upload the representations

```js
condition: () => questionHasAnswer(response, questions.representationsFromOthers, 'yes');
```

## Planning officer’s report and supporting documents

- multi-file-upload `/upload-planning-officers-report-decision-notice/` Upload the planning officer’s report or what your decision notice would have said
- boolean `/other-development-plan-policies/` Do you have any relevant policies from your statutory development plan?
- multi-file-upload `/upload-development-plan-policies/` Upload relevant policies from your statutory development plan

```js
condition: () => questionHasAnswer(response, questions.developmentPlanPolicies, 'yes');
```

- boolean `/emerging-plan/` Do you have an emerging plan that is relevant to this appeal?
- multi-file-upload `/upload-emerging-plan/` Upload the emerging plan and supporting information

```js
condition: () => questionHasAnswer(response, questions.emergingPlan, 'yes');
```

- boolean `/other-relevant-policies/` Do you have any other relevant policies to upload?
- multi-file-upload `/upload-other-relevant-policies/` Upload any other relevant policies

```js
condition: () => questionHasAnswer(response, questions.otherRelevantPolicies, 'yes');
```

- boolean `/supplementary-planning-documents/` Did any supplementary planning documents inform the outcome of the planning application?
- multi-file-upload `/upload-policies-supplementary-planning-documents/` Upload relevant policy extracts and supplementary planning documents

```js
condition: () => questionHasAnswer(response, questions.supplementaryPlanning, 'yes');
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

- radio `/new-conditions/` Check if there are any new conditions
