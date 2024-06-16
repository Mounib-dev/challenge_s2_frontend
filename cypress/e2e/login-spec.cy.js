describe('Login Page', () => {
  it('should show an alert with an error message on failed login', () => {
    cy.visit('/login')

    //Non-existing email on the db
    cy.get('input[name="username"]').type('test@test.fail')

    cy.get('input[name="password"]').type('Test@123')

    cy.get('button[type="submit"]').click()

    cy.get('.v-alert').should('be.visible')
    cy.get('.v-alert').should('contain', "We couldn't find an account associated with this email.")

    //Existing email on the db
    cy.get('input[name="username"]').clear().type('ouroua@dev.io')

    //With a wrong password
    cy.get('input[name="password"]').clear().type('Test')

    cy.get('button[type="submit"]').click()

    cy.get('.v-alert').should('be.visible')
    cy.get('.v-alert').should('contain', 'Invalid credentials.')
  })

  it('should navigate to / on successful login', () => {
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
})
