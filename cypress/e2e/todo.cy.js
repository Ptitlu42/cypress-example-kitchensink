/// <reference types="cypress" />

describe('example todo app', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/todo')
    })

    it('focuses input on load', () => {
    })

    it('displays two todo items by default', () => {
        cy.get('.todo-list li')
        .should('have.length', 2)
    })

    it('First todo item has correct text', () => {
        cy.get('.todo-list li').first()
        .should('have.text', 'Pay electric bill')
    })

    it('Last todo item has correct text', () => {
        cy.get('.todo-list li').last()
        .should('have.text', 'Walk the dog')
    })

    it('can add new todo items', () => {
        const newItem = 'Feed the cat'
        cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)
        cy.get('.todo-list li')
        .should('have.length', 3)
        .last()
        .should('have.text', newItem)
    })

    it('can check off an item as completed', () => {
        cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check()
        cy.contains('Pay electric bill')
        .parents('li')
        .should('have.class', 'completed')
    })

    it('can edit an existing todo item', () => {
        const newText = 'Pay water bill'
        
        cy.get('.todo-list li').first()
        .dblclick()
        
        cy.get('.todo-list li').first()
        .find('.edit')
        .clear()
        .type(`${newText}{enter}`)
        
        cy.get('.todo-list li')
        .should('have.length', 2)
        .first()
        .should('have.text', newText)
    })

    it('can delete existing todo item', () => {
        cy.get('.destroy').first()
        .invoke('show')
        .click()
        cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('not.have.text', 'Pay electric bill')
    })

    it('footer 1, can display number of left items', () => {
        cy.get('.todo-count')
        .should('contain', '2 items left')
    })

    it('footer 2, display number of left items after inserting a new item', () => {
        const newItem = 'Feed the cat'
        cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)
        cy.get('.todo-list li')
        .should('have.length', 3)
        .last()
        .should('have.text', newItem)
        cy.get('.todo-count')
        .should('contain', '3 items left')
    })

    it('footer 3, display number of left items after completing an item', () => {cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check()
        cy.get('.todo-count')
        .should('contain', '1 item left')
    })

    it('footer 4, display number of left items after deleting an item', () => {cy.get('.destroy').first()
        .invoke('show').click()
        cy.get('.todo-count')
        .should('contain', '1 item left')
    })

    context('with a checked task', () => {
        beforeEach(() => {
            cy.contains('Pay electric bill')
            .parent()
            .find('input[type=checkbox]')
            .check()
        })

        it('can filter for uncompleted tasks', () => {
            cy.contains('Active').click()
            cy.get('.todo-list li')
            .should('have.length', 1)
            .first()
            .should('have.text', 'Walk the dog')
            cy.contains('Pay electric bill').should('not.exist')
        })

        it('can filter for completed tasks', () => {
            cy.contains('Completed').click()
            cy.get('.todo-list li')
            .should('have.length', 1)
            .first()
            .should('have.text', 'Pay electric bill')
        })

        it('can delete all completed tasks', () => {
            cy.contains('Clear completed').click()
            cy.get('.todo-list li')
            .should('have.length', 1)
            .first()
            .should('have.text', 'Walk the dog')
            cy.contains('Pay electric bill').should('not.exist')
        })
    })
})