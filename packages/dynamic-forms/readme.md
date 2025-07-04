# Dynamic form renderer

Plan is to eventually move to npm package spin off from this: https://github.com/Planning-Inspectorate/dynamic-forms

## Terminology

- Component - A "blueprint" of a type of question. i.e. input, radio button, checkbox etc.
- Question - A specific question within a journey which is made up of one (usually) or many -(sometimes) components and their required content.
- Section - A group of Questions
- Journey - An entire set of questions required for a completion of a submission (either by Appellant or LPA or other user type)
- Answer - Data input by a user against a specific Question.
- Response - a collection of answers submitted as part of a Journey.
- Validation - Verification that an individual Answer meets the criteria of that Question. i.e. String is greater than 3 characters.

## Folder structure

Attempting to follow a component based folder structure so that all logic for a component is held in one place including any related tests

Components are in the the dynamic-components folder to avoid name clashes when nunjucks attempts to find the views with the existing view folder (see viewPaths in app.js in ./src)

## Aim moving forward

- Class definitions and component/validation logic in this package, no dependencies on other packages in this repo
- Middleware/controller/save logic in forms-web-app - injected in where needed
- Journey/question definitions in common
