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

  it('should navigate to tasks page, clicks to add new employee and add it then edits it and finally deletes it', () => {
    cy.visit('/tasks')
    cy.contains('.v-btn__content', '+ New Task').click()

    cy.url().should('include', '/task/add')
    cy.get('input[name="title"]').type('Cypress Task')
    cy.get('input[name="description"]').type('Cypress Task Description')
    // cy.get('#priority').first().get('.mdi-menu-down').click()
    cy.get('.v-select')
      .first()
      .within(() => {
        cy.contains('label', 'Priority').get('.mdi-menu-down').click()
      })
    cy.get('.v-list-item').contains('Medium').click()

    cy.get('input[name="deadline"]').clear().type('2023-06-16').should('have.value', '2023-06-16')

    // cy.get('.v-select')
    //   .first()
    //   .within(() => {
    //     cy.contains('label', 'Assign To').get('.mdi-menu-down').click()
    //   })
    // cy.get('.v-list-item').contains('Mounib OUROUA').click()
    //     cy.get('input[name="firstname"]').type('Cypress')
    //     cy.get('input[name="lastname"]').type('Tests')
    //     cy.get('input[name="jobTitle"]').type('Cypress Tester')
    //     cy.get('input[name="email"]').type('cypress@test.dev')
    //     cy.get('input[name="password"]').type('Cypress@123456')

    //     cy.get('.v-btn__content').contains('Add').click()

    //     cy.url().should('include', '/teamMembers')
    //     cy.get('.mdi-arrow-right').click()
    //     cy.contains('.v-card-title', 'Cypress Tests').within(() => {
    //       cy.get('.v-btn__content').contains('View Profile').click()
    //     })
    //     cy.get('.mdi-pencil').click()
    //     cy.get('input[name="firstname"]').clear().type('Cypress')
    //     cy.get('input[name="lastname"]').clear().type('Edit')
    //     cy.contains('.v-btn__content', 'Edit').click()

    //     cy.get('.mdi-pencil').click()
    //     cy.contains('.v-btn__content', 'Delete').click()
    //     cy.get('.v-dialog').should('be.visible')
    //     cy.get('.v-dialog .v-card').contains('Are you sure you want to delete this employee?')
    //     cy.contains('.v-btn__content', 'Yes').click()
  })
})
