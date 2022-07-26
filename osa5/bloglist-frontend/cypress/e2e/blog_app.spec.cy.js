describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'tester',
      name: 'Tester Jestersson',
      password: 'testerjester'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('blogs')
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('tester')
      cy.get('#password').type('testerjester')
      cy.get('#login-button').click()

      cy.contains('Tester Jestersson logged in')
    })

    it('fails with wrong password', function () {
      cy.contains('login').click()
      cy.get('#username').type('tester')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'tester', password: 'testerjester' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()

      cy.get('#title').type('Testing Cypress')
      cy.get('#author').type('Tester')
      cy.get('#url').type('testing-dot-com')
      cy.get('#create-blog-button').click()

      cy.contains('Testing Cypress Tester')
    })

    it('A blog can be liked', function () {
      cy.createBlog({ title: 'Cypress by command', author: 'Another tester', url: 'test.url' })
      cy.contains('Cypress by command Another tester').as('theBlog')
      cy.get('@theBlog').contains('view').click()
      cy.get('@theBlog').contains('likes 0')
      cy.get('@theBlog').contains('like').click()
      cy.get('@theBlog').contains('likes 1')
    })

    it('A blog can be removed', function () {
      cy.createBlog({ title: 'Cypress to remove', author: 'Remove tester', url: 'test.remove' })
      cy.contains('Cypress to remove Remove tester').as('theBlog')
      cy.get('@theBlog').contains('view').click()
      cy.get('@theBlog').get('#remove-button').click()
      cy.get('@theBlog').should('not.exist')
    })

    it.only('The blogs are ordered by likes', function() {
      cy.createBlog({ title: 'Cypress by command', author: 'Another tester', url: 'test.url' })
      cy.createBlog({ title: 'Cypress to remove', author: 'Remove tester', url: 'test.remove' })
      cy.contains('Cypress by command Another tester').as('firstBlog')
      cy.contains('Cypress to remove Remove tester').as('secondBlog')

      cy.get('@firstBlog').contains('view').click()
      cy.get('@secondBlog').contains('view').click()

      cy.get('.blog').eq(0).should('contain', 'Cypress by command')

      cy.get('@secondBlog').contains('like').click()
      cy.wait(500)
      cy.get('.blog').eq(0).should('contain', 'Cypress to remove')

      cy.get('@firstBlog').contains('like').click()
      cy.wait(500)
      cy.get('@firstBlog').contains('like').click()
      cy.wait(500)
      cy.get('.blog').eq(0).should('contain', 'Cypress by command')
    })
  })
})