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

  it('should navigate to teams page', () => {
    cy.visit('/teams')
    cy.get('.v-btn__content').contains('New team').click()
    cy.get('.v-btn__content').contains('Add').click()

    cy.contains('This field is required').should('be.visible')
  })
  it('It should navigate to teams page, and then to adding new team page click add button and show error', () => {
    cy.visit('/teams')
    cy.get('.v-btn__content').contains('New team').click()
    cy.get('.v-btn__content').contains('Add').click()

    cy.contains('This field is required').should('be.visible')
  })
  it('submits the form with valid data and creates a new team, edits it and then deletes it', () => {
    cy.visit('/teams')

    //Add new team
    cy.get('.v-btn__content').contains('New team').click()
    cy.get('input[name="teamName"]').type('Cypress Test')
    cy.get('textarea[name="description"]').type('This is a description from Cypress test')
    cy.get('input[name="creationDate"]').type('2023-06-16')
    cy.get('.v-btn__content').contains('Add').click()
    cy.url().should('include', '/teams')

    cy.scrollTo('bottom')
    cy.contains('.team-card', 'Cypress Test').within(() => {
      cy.contains('button', 'Details').click()
    })
    cy.get('.v-dialog').should('be.visible')

    cy.get('.v-btn__content').contains('Edit').click()
    cy.get('input[name="teamName"]').type(' Edit')
    cy.get('.v-btn__content').contains('Edit').click()

    cy.contains('.team-card', 'Cypress Test Edit').within(() => {
      cy.contains('button', 'Details').click()
    })
    cy.get('.v-btn__content').contains('Delete').click()
    cy.get('.v-btn__content').contains('Yes').click()
  })
})
