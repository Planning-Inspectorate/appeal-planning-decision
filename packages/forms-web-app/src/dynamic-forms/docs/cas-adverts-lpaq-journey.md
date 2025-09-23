# cas-adverts-lpaq

## Constraints, designations and other issues

- boolean `/correct-appeal-type/` Is a <appeal type> appeal the correct type of appeal?
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
- boolean `/area-special-control/` Is the site in an area of special control of advertisements?
- boolean `/green-belt/` Is the site in a green belt?
- boolean `/area-of-outstanding-natural-beauty/` Is the appeal site in an area of outstanding natural beauty?
- checkbox `/designated-sites/` Is the development in, near or likely to affect any designated sites?

## Planning officer's report and supporting documents

- boolean `/public-safety/` Did you refuse the application because of highway or traffic public safety?
- boolean `/accurate-photographs-plans/` Did the appellant submit complete and accurate photographs and plans?

## Appeal process

- radio `/new-conditions/` Check if there are any new conditions
