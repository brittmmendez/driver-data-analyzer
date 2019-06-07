describe('Products Page', () => {
  it('loads products', () => {
    // cy.visit('/products-page');
    cy.getProducts();
    cy.wait(2000);
    cy.get('[data-cy=catalog-item]');
  });

  it('loads products with prices', () => {
    cy.contains('$');
  });

  it('links to product show page', () => {
    cy.get('[data-cy=catalog-item]')
      .first('[data-cy=catalog-item]')
      .click();
    cy.get('[data-cy=add-to-bag]');
  });
});
