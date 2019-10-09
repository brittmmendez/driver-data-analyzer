describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
  })

  it('links to analyze page', () => {
    cy.visit('/')
    cy.viewport('macbook-15');
    cy.get('[data-cy=analyze-page-link]').click();
    cy.get('[data-cy=analyze-page]')
  })

  it('links to about page', () => {
    cy.visit('/')
    cy.viewport('macbook-15');
    cy.get('[data-cy=about-page-link]').click();
    cy.get('[data-cy=about-page]')
  })
});