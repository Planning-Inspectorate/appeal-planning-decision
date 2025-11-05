# enforcement-appeal-form

## Prepare appeal

- boolean `/application-name/` Was the application made in your name?
- multi-field-input `/applicant-name/` What is the applicant's name?

```js
condition: () => questionHasAnswer(response, questions.applicationName, 'no');
```
