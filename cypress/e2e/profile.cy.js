describe('Profile Page Tests', () => {
    const username = 'b6410546246';
    const password = 'Preme2804!';
    const baseUrl = 'http://localhost:3001';
  
    beforeEach(() => {
      cy.visit(baseUrl);
      cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));
      cy.get('#username').type(username);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', `/score/${username}`);
      cy.contains('Profile').click();
      cy.url().should('include', `/profile/${username}`);
    });
  
    it('should load Profile page from navbar after login', () => {
      cy.contains(username).should('exist');
      cy.get('img[alt="User Profile"]').should('exist');
      cy.contains('Round').should('exist');
    });
  
    it('should update chart and score info when round is changed', () => {
      cy.get('#round-select').should('exist');
      cy.get('#round-select').click();
      cy.get('ul > li').eq(1).click(); // Select second round
  
      cy.get('.MuiChartsLegend-root', { timeout: 5000 }).should('exist');
      cy.contains('Your score:').should('exist');
      cy.contains('Mean:').should('exist');
      cy.contains('Max:').should('exist');
      cy.contains('Min:').should('exist');
      cy.contains('SD:').should('exist');
    });
  
    it('should display student first name, last name, faculty, and major', () => {
      cy.contains('Ratticha PARINTHIP').should('exist');
      cy.contains('Engineering').should('exist');
      cy.contains('Software & Knowledge Engineering').should('exist');
    });
  
    it('should display score comparison chart and class statistics', () => {
      cy.contains('Statistics').should('exist');
      cy.contains('Score Compare with Average').should('exist');
      cy.get('.MuiChartsLegend-root', { timeout: 5000 }).should('exist');
      cy.contains('Your score:').should('exist');
      cy.contains('Mean:').should('exist');
      cy.contains('Max:').should('exist');
      cy.contains('Min:').should('exist');
      cy.contains('SD:').should('exist');
    });
  
    it('should redirect to NotFound if password is missing from localStorage', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('username', username);
        win.localStorage.setItem('password', '');
      });
  
      cy.visit(`${baseUrl}/profile/${username}`);
      cy.contains('ERROR PAGE NOT FOUND', { timeout: 10000 }).should('be.visible');
    });
  });
  