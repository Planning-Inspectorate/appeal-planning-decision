import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';


const url = 'full-appeal/submit-appeal/task-list';
const pageTitle = 'Check your answers - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Check your answers';


Given("an appellant or agent is on the 'Planning Application form' page",()=> {
  goToAppealsPage(url);
})
When("they click the 'Continue'",()=> {
  goToAppealsPage(url);
})
Then("'What is your Planning Application Number' page is displayed",()=> {
  goToAppealsPage(url);
})

Given("an appellant or agent is on the 'What is your Planning Application number' page",()=> {
  goToAppealsPage(url);
})
When("they enter text into the box and click 'Continue'",()=> {
  goToAppealsPage(url);
})
Then("the page 'Did you submit a design and access statement with your application?' is displayed",()=> {
  goToAppealsPage(url);
})

Given("an agent has not provided any details",()=> {
  goToAppealsPage(url);
})

Then("an error message 'Enter the original planning application number' is displayed",()=> {
  goToAppealsPage(url);
})

Given("an agent has entered more than 30 characters into the text box",()=> {
  goToAppealsPage(url);
})
Then("an error message 'The application number must be no more than 30 characters' is displayed",()=> {
  goToAppealsPage(url);
})

Given("an agent is on the 'What is your planning application' page",()=> {
  goToAppealsPage(url);
})
When("they click on the 'Back' link",()=> {
  goToAppealsPage(url);
})
Then("they are presented with the 'Planning Application form' page",()=> {
  goToAppealsPage(url);
})
