describe('Score Page Suite', () => {
  const username = 'b6410546246';
  const password = 'Preme2804!';
  const baseUrl = 'http://localhost:3001';

  it('should log in and display score page correctly', () => {
    cy.visit(baseUrl);

    cy.window().then(win => cy.stub(win, 'alert').as('alertStub'));

    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', `/score/${username}`);

    cy.contains('01204111 Computer and Programming').should('exist');
    cy.contains('Round 1').should('exist');
    cy.contains('Start Strong').should('exist');
  });

  it('should allow user to switch rounds using dropdown', () => {
    cy.visit(baseUrl);

    cy.window().then(win => cy.stub(win, 'alert').as('alertStub'));

    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', `/score/${username}`);

    cy.contains('Round 1').should('exist');

    cy.contains('Round').click();
    cy.contains('Round 2').click();

    cy.contains('Round 2').should('exist');
  });


  it('should display the StudyProgress component', () => {
    cy.visit(baseUrl);

    cy.window().then(win => cy.stub(win, 'alert').as('alertStub'));

    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', `/score/${username}`);

    cy.contains('Exercise History').should('exist');
  });
  
});
