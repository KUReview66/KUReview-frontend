describe('Login Page', () => {
    it('should log in and redirect to the score page', () => {
      // Visit your login page
      cy.visit('http://localhost:3001'); // or wherever your login route is
  
      // Type in the username and password
      cy.get('#username').type('b6410546246'); // replace with your actual test username
      cy.get('#password').type('Preme2804!'); // replace with your actual test password
  
      // Intercept the login API call
      cy.intercept('POST', 'http://localhost:3000/login').as('loginRequest');
  
      // Click the login button
      cy.get('button[type="submit"]').click();
  
      // Wait for the request to complete
      cy.wait('@loginRequest');
  
      // Check if redirected to the correct score page
      cy.url().should('include', '/score/b6410546246'); // change 'testuser' to match the one you typed
      cy.intercept('POST', 'http://localhost:3000/login', {
        statusCode: 200,
        body: { success: true },
      });

    });
    it('should show alert on invalid login', () => {
        cy.visit('http://localhost:3001'); // use your actual frontend port
      
        cy.window().then((win) => {
          cy.stub(win, 'alert').as('alertStub'); // set the spy BEFORE the alert can happen
        });
      
        cy.get('#username').type('wronguser');
        cy.get('#password').type('wrongpass');
        cy.get('button[type="submit"]').click();
      
        // Assert that alert was called with the correct message
        cy.get('@alertStub').should('have.been.calledWith', 'Invalid login detail');
      });
      it('should not allow login with empty fields', () => {
        cy.visit('http://localhost:3001');
      
        cy.get('button[type="submit"]').click();
      
        // Should still be on the login page
        cy.url().should('eq', 'http://localhost:3001/');
      });
            
      
  });
  