# has-lpaq

## Constraints, designations and other issues

- boolean `/correct-appeal-type/` Is <appeal type with an or a> appeal the correct type of appeal?
- boolean `/affect-listed-building/` Does the proposed development affect the setting of listed buildings?
- list-add-more `/affected-listed-buildings/` Add another building or site?

```js
condition: () =>
	response.answers && response.answers[questions.listedBuildingCheck.fieldName] == 'yes';
```

- boolean `/conservation-area/` Is the site in, or next to a conservation area?
- multi-file-upload `/upload-conservation-area-map-guidance/` Upload conservation map and guidance

```js
condition: () =>
	response.answers && response.answers[questions.conservationArea.fieldName] == 'yes';
```

- boolean `/green-belt/` Is the site in a green belt?

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

- boolean `/representations/` Did you receive representations from members of the public or other parties?
- multi-file-upload `/upload-representations/` Upload the representations

```js
condition: () =>
	response.answers && response.answers[questions.representationsFromOthers.fieldName] == 'yes';
```

## Planning officer's report and supporting documents

- multi-file-upload `/upload-planning-officers-report-decision-notice/` Upload the planning officer’s report or what your decision notice would have said
- multi-file-upload `/upload-plans-drawings/` Upload the plans, drawings and list of plans
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

- boolean `/supplementary-planning-documents/` Did any supplementary planning documents inform the outcome of the planning application?
- multi-file-upload `/upload-policies-supplementary-planning-documents/` Upload relevant policy extracts and supplementary planning documents

```js
condition: () => questionHasAnswer(response, questions.supplementaryPlanning, 'yes');
```

## Site access

- radio `/inspector-access-appeal-site/` Might the inspector need access to the appellant’s land or property?
- radio `/inspector-enter-neighbour-site/` Might the inspector need to enter a neighbour’s land or property?
- list-add-more `/neighbour-address/` Do you want to add another neighbour to be visited?

```js
condition: () =>
	response.answers && response.answers[questions.neighbouringSite.fieldName] == 'yes';
```

- radio `/potential-safety-risks/` Add potential safety risks

## Appeal process

- boolean `/ongoing-appeals/` Are there any other ongoing appeals next to, or close to the site?
- list-add-more `/appeal-reference-number/` Add another appeal?

```js
condition: () => response.answers && response.answers[questions.appealsNearSite.fieldName] == 'yes';
```

- radio `/new-conditions/` Check if there are any new conditions
