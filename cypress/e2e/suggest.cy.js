describe('Suggestion Page - Full Functional Test Suite', () => {
    const username = 'b6410546246';
    const password = 'Preme2804!';
    const round = 'comproExamR1';
    const unit = '02-Basic'; // Change this if needed
    const baseUrl = 'http://localhost:3001';
  
    beforeEach(() => {
      cy.visit(`${baseUrl}/suggest/${username}/${round}`);
  
      cy.window().then((win) => {
        win.localStorage.setItem('username', username);
        win.localStorage.setItem('password', password);
      });
  
      cy.contains(unit, { timeout: 10000 }).click();
  
      // Wait until OpenAI content is generated (or backend returns it)
      cy.contains('Generating content...', { timeout: 20000 }).should('not.exist');
    });
  
    it('should load Suggestion Page and fetch content when unit is selected', () => {
      cy.contains('Page 1').should('exist');
      cy.contains('Quiz').should('exist');
    });
  
    it('should complete quiz correctly and enable "Next" button', () => {
      cy.get('.quizButton').first().click();
      cy.contains('Next ▶').should('not.be.disabled');
    });
  
    it('should show alert when wrong quiz answer is selected', () => {
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });
  
      cy.get('.quizButton').first().click();
      cy.get('@alertStub').should('have.been.calledWithMatch', /Incorrect answer/);
    });
  
    it('should switch to KU Video tab and load video', () => {
      cy.contains('KU Video').click();
      cy.get('iframe, video', { timeout: 10000 }).should('exist');
    });
  
    it('should redo a unit and reset the progress', () => {
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
        cy.stub(win, 'alert').as('alertStub');
      });
  
      cy.contains(`Redo all contents in ${unit}`).click();
      cy.contains('Select a unit to see the learning content').should('exist');
      cy.get('@alertStub').should('have.been.calledWithMatch', /reset/);
    });
  
    it('should redirect to NotFound if password is missing', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('username', username);
        win.localStorage.setItem('password', '');
      });
  
      cy.visit(`${baseUrl}/suggest/${username}/${round}`);
      cy.contains('404').should('exist');
      cy.contains('ERROR PAGE NOT FOUND').should('exist');
    });
  });
  