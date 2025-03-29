describe('Score History Page – Unit Score Visualization and Navigation', () => {
    const username = 'b6410546246';
    const baseUrl = 'http://localhost:3001';
  
    beforeEach(() => {
      cy.visit(`${baseUrl}/history/${username}`);
    });
  
    it('should load chart or show no score message for default unit', () => {
      cy.contains('Exercise Score History').should('exist');
      cy.contains('Select Unit:').should('exist');
  
      // Either chart appears or fallback message
      cy.get('body').then(($body) => {
        if ($body.text().includes('No score yet')) {
          cy.contains('No score yet for Unit').should('exist');
          cy.contains('Go to Exercise').should('exist');
        } else {
          cy.get('.recharts-line', { timeout: 10000 }).should('exist');
        }
      });
    });
  
    it('should switch to another unit and show chart or fallback', () => {
      cy.get('select').select('Unit 3');
  
      cy.get('body').then(($body) => {
        if ($body.text().includes('No score yet')) {
          cy.contains('No score yet for Unit 3').should('exist');
          cy.contains('Go to Exercise').should('exist');
        } else {
          cy.get('.recharts-line', { timeout: 10000 }).should('exist');
        }
      });
    });
  
    it('should list highest score by unit and allow navigation', () => {
      cy.contains('Highest Score by Unit').should('exist');
      cy.contains('Unit 2:').should('exist');
      cy.contains('Go to Exercises').first().click();
  
      cy.url().should('include', '/exerciseU');
      cy.url().should('include', `/${username}`);
    });
  });
  