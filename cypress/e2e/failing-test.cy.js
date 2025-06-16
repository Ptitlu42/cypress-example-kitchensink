describe('Intentional failure tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080')
    })

    it('Test that fails - non-existent element', () => {
        cy.get('.element-that-does-not-exist')
            .should('be.visible')
    })

    it('Test that fails - incorrect assertion', () => {
        cy.get('h1')
            .should('contain.text', 'Text that does not exist')
    })

    it('Test that fails - timeout on action', () => {
        cy.get('body').click()
        cy.get('.button-that-does-not-exist', { timeout: 3000 })
            .click()
    })

    it('Test that fails - incorrect URL verification', () => {
        cy.url().should('include', '/non-existent-page')
    })

    it('Test that passes for comparison', () => {
        cy.get('h1').should('exist')
        cy.title().should('include', 'Kitchen Sink')
    })
}) 