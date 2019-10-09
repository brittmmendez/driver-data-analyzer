describe('The Analyze Page', () => {
  it('successfully loads', () => {
    cy.visit('/analyze')
  })

  it('gives directions on how to load files', () => {
    cy.visit('/analyze')
    cy.get('[data-cy=analyze-directions]')
  })

  it('provides a button to upload file', () => {
    cy.visit('/analyze')
    cy.get('[data-cy=upload-data-btn]')
  })
});