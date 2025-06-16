import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I visit the Todo application', () => {
  cy.visit('/commands/actions');
  cy.get('.action-btn').click();
  cy.get('#todo-item').clear();
});

Then('I should see {int} default tasks', (count) => {
  cy.get('#todo-list li').should('have.length', count);
});

Then('the first task should be {string}', (text) => {
  cy.get('#todo-list li').first().should('contain.text', text);
});

Then('the last task should be {string}', (text) => {
  cy.get('#todo-list li').last().should('contain.text', text);
});

When('I add a new task {string}', (text) => {
  cy.get('#todo-item').type(text).type('{enter}');
});

Then('I should see {int} tasks in total', (count) => {
  cy.get('#todo-list li').should('have.length', count);
});

Then('the new task {string} should be visible', (text) => {
  cy.get('#todo-list li').should('contain.text', text);
});

When('I mark the task {string} as completed', (text) => {
  cy.get('#todo-list li').contains(text).find('.toggle').click();
});

Then('the task {string} should have the class {string}', (text, className) => {
  cy.get('#todo-list li').contains(text).should('have.class', className);
});

Then('the counter should display {string}', (text) => {
  cy.get('#todo-count').should('contain.text', text);
});

When('I delete the first task', () => {
  cy.get('#todo-list li').first().find('.destroy').click({ force: true });
});

Then('I should see {int} remaining task', (count) => {
  cy.get('#todo-list li').should('have.length', count);
});

Then('the task {string} should no longer be visible', (text) => {
  cy.get('#todo-list li').should('not.contain.text', text);
});

Given('I mark the task {string} as completed', (text) => {
  cy.get('#todo-list li').contains(text).find('.toggle').click();
});

When('I click on the {string} filter', (filter) => {
  cy.get('.filters').contains(filter).click();
});

Then('I should see only {int} task', (count) => {
  cy.get('#todo-list li:visible').should('have.length', count);
});

Then('I should see the task {string}', (text) => {
  cy.get('#todo-list li:visible').should('contain.text', text);
});

Then('I should not see the task {string}', (text) => {
  cy.get('#todo-list li:visible').should('not.contain.text', text);
});

When('I click on {string}', (buttonText) => {
  cy.get('.clear-completed').click();
}); 