# enforcement-lpaq

## Constraints, designations and other issues

- boolean `/correct-appeal-type/` Is <appeal type with an or a> appeal the correct type of appeal?
- boolean `/changes-listed-building/` Does the proposed development change a listed building?
- list-add-more `/changed-listed-buildings/` Add another building or site?

```js
condition: () => questionHasAnswer(response, questions.changesListedBuilding, 'yes');
```

## Site access

- radio `/inspector-access-appeal-site/` Might the inspector need access to the appellant’s land or property?

## Appeal process

- radio `/procedure-type/` Which procedure do you think is most appropriate for this appeal?
