describe('template spec', () => {
    it('contains the calculate button', () => {
        cy.visit('http://localhost:3000/')

        cy.get('[data-testid="calculate-button"]').should('exist')
    })

    it('shows error message when calculate button is pressed when input is empty', () => {
        cy.visit('http://localhost:3000/')

        cy.get('[data-testid="calculate-button"]').click()

        cy.get('[data-testid="input-error"]').should('be.visible')
    })

    it('calls handleSubmit when input is filled and button is clicked', () => {
        cy.intercept('POST', 'http://localhost:5000/api/lookup').as(
            'postLookup'
        )

        cy.visit('http://localhost:3000')

        cy.get('[data-testid="url-input"]').type('yahoo.com')

        cy.get('[data-testid="calculate-button"]').click()

        cy.wait('@postLookup')
            .its('request.body.domain')
            .should('eq', 'yahoo.com')
    })
})
