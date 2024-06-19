describe('Teams page', () => {
  beforeEach(() => {
    cy.visit('/login')

    cy.get('input[name="username"]').type('ouroua@dev.io')

    cy.get('input[name="password"]').type('Test@123')

    cy.get('button[type="submit"]').click()

    cy.get('.v-alert').should('be.visible')
    cy.get('.v-alert').should(
      'contain',
      'Authentication successful, please wait as you will be redirected'
    )

    cy.url().should('include', '/')
  })

  it('should navigate to employees page, clicks to add new employee and add it', () => {
    cy.visit('/teamMembers')
    cy.get('.mdi-account-plus-outline').click()

    cy.url().should('include', '/employees/add')
    cy.get('input[name="firstname"]').type('Cypress')
    cy.get('input[name="lastname"]').type('Tests')
    cy.get('input[name="jobTitle"]').type('Cypress Tester')
    cy.get('input[name="email"]').type('cypress@test.dev')
    cy.get('input[name="password"]').type('Cypress@123456')

    cy.get('.v-btn__content').contains('Add').click()

    cy.url().should('include', '/teamMembers')
    cy.get('.mdi-arrow-right').click()
    cy.contains('.v-card-title', 'Cypress Tests').within(() => {
      cy.get('.v-btn__content').contains('View Profile').click()
    })
    cy.get('.mdi-pencil').click()
    cy.get('input[name="firstname"]').clear().type('Cypress')
    cy.get('input[name="lastname"]').clear().type('Edit')
    cy.contains('.v-btn__content', 'Edit').click()

    cy.get('.mdi-pencil').click()
    cy.contains('.v-btn__content', 'Delete').click()
    cy.get('.v-dialog').should('be.visible')
    cy.get('.v-dialog .v-card').contains('Are you sure you want to delete this employee?')
    cy.contains('.v-btn__content', 'Yes').click()
  })
})
