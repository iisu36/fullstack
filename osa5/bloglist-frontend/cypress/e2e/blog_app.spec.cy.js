describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000')
  })
  it('front page can be opened', function () {
    cy.contains('blogs')
    cy.contains('login')
  })

  it('user can login', function () {
    cy.contains('login').click()
    cy.get('#username').type('tester')
    cy.get('#password').type('testerjester')
    cy.get('#login-button').click()

    cy.contains('Tester Jestersson logged in')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.contains('login').click()
      cy.get('#username').type('tester')
      cy.get('#password').type('testerjester')
      cy.get('#login-button').click()
    })

    it('a new blog can be created', function () {
      cy.contains('new blog').click()
      
    })
  })
})