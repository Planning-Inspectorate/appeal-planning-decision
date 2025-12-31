# enforcement-lpaq

## Constraints, designations and other issues

- boolean `/correct-appeal-type/` Is enforcement the correct type of appeal?
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
- boolean `/public-right-of-way/` Was a public right of way removed or diverted?
- multi-file-upload `/upload-definitive-map-statement/` Upload the definitive map and statement extract

```js
condition: () => questionHasAnswer(response, questions.enforcementRightOfWayCheck, 'yes');
```

- boolean `/other-operations/` Does the enforcement notice relate to building, engineering, mining or other operations?
- number-entry `/site-area/` What is the area of the appeal site?
- boolean `/alleged-breach-area/` Is the area of the alleged breach the same as the site area?
- boolean `/create-floor-space/` Does the alleged breach create any floor space?
- boolean `/refuse-waste-materials/` Does the enforcement notice include a change of use of land to dispose, refuse or waste materials?
- boolean `/mineral-extraction-materials/` Does the enforcement notice include the change of use of land to dispose of remaining materials after mineral extraction?
- boolean `/store-minerals/` Does the enforcement notice include a change of use of land to store minerals in the open?
- boolean `/create-building/` Does the enforcement notice include the erection of a building or buildings?
- boolean `/agricultural-purposes/` Is the building on agricultural land and will it be used for agricultural purposes?
- boolean `/single-house/` Is the enforcement notice for a single private dwelling house?
- radio `/trunk-road/` Is the appeal site within 67 metres of a trunk road?
- boolean `/crown-land/` Is the appeal site on Crown land?
- boolean `/stop-notice/` Did you serve a stop notice?
- multi-file-upload `/upload-stop-notice/` Upload the stop notice

```js
condition: () => questionHasAnswer(response, questions.enforcementStopNotice, 'yes');
```

- boolean `/remove-permitted-development-rights/` Did you remove any permitted development rights for the appeal site?
- multi-file-upload `/upload-article-4-direction/` Upload the article 4 direction

```js
condition: () => questionHasAnswer(response, questions.enforcementDevelopmentRights, 'yes');
```

- text-entry `/rights-removed-direction/` What permitted development rights did you remove with the direction?

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
	questionHasAnswer(response, questions.environmentalImpactSchedule, 'no') ||
	questionHasAnswer(response, questions.environmentalImpactSchedule, 'schedule-2');
```

- multi-file-upload `/upload-screening-opinion/` Upload your screening opinion and any correspondence

```js
condition: () => questionHasAnswer(response, questions.screeningOpinion, 'yes');
```

- boolean `/screening-opinion-environmental-statement/` Did your screening opinion say the development needed an environmental statement?

```js
condition: () => questionHasAnswer(response, questions.screeningOpinion, 'yes');
```

- radio `/environmental-statement/` Did the appellant submit an environmental statement?
- multi-file-upload `/upload-environmental-statement/` Upload the environmental statement and supporting information

```js
condition: () =>
	questionHasAnswer(response, questions.submitEnvironmentalStatementAppellant, 'yes');
```

- multi-file-upload `/upload-screening-direction/` Upload the screening direction

```js
condition: () => questionHasAnswer(response, questions.screeningOpinion, 'yes');
```

## Notifying relevant parties

- multi-file-upload `/upload-enforcement-list/` Upload the list of people that you served the enforcement notice to
- multi-file-upload `/appeal-notification-letter/` Upload the appeal notification letter and the list of people that you notified

## Planning officer’s report and supporting documents

- boolean `/planning-officer-report/` Do you have a planning officer’s report?
- multi-file-upload `/upload-planning-officers-report-decision-notice/` Upload the planning officer’s report or what your decision notice would have said

```js
condition: () => questionHasAnswer(response, questions.planningOfficersReport, 'yes');
```

- boolean `/other-development-plan-policies/` Do you have any relevant policies from your statutory development plan?
- multi-file-upload `/upload-development-plan-policies/` Upload relevant policies from your statutory development plan

```js
condition: () => questionHasAnswer(response, questions.developmentPlanPolicies, 'yes');
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

- boolean `/local-development-order/` Do you have a local development order?
- multi-file-upload `/upload-local-development-order/` Upload the local development order

```js
condition: () => questionHasAnswer(response, questions.localDevelopmentOrder, 'yes');
```

- boolean `/previous-planning-permission/` Did you previously grant any planning permission for this development?
- multi-file-upload `/upload-planning-permission/` Upload the planning permission and any other relevant documents

```js
condition: () => questionHasAnswer(response, questions.previousPlanningPermission, 'yes');
```

- boolean `/enforcement-notice-date-application/` Was there an enforcement notice in force at the date of the application?
- multi-file-upload `/upload-enforcement-notice/` Upload the enforcement notice

```js
condition: () => questionHasAnswer(response, questions.enforcementNoticeDateApplication, 'yes');
```

- multi-file-upload `/upload-enforcement-notice-plan/` Upload the enforcement notice plan

```js
condition: () => questionHasAnswer(response, questions.enforcementNoticeDateApplication, 'yes');
```

- boolean `/planning-contravention-notice/` Did you serve a planning contravention notice?
- multi-file-upload `/upload-planning-contravention-notice/` Upload the planning contravention notice

```js
condition: () => questionHasAnswer(response, questions.planningContraventionNotice, 'yes');
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
