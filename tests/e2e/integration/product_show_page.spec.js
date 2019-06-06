describe('Product Show Page', () => {
  it('loads Product Show Page', () => {
    // cy.visit('/products-page');
    cy.getProducts();
    cy.wait(2000);
    cy.get('[data-cy=catalog-item]')
      .first('[data-cy=catalog-item]')
      .click({ force: true });
    cy.get('.content');
  });

  it('can add product to bag', () => {
    cy.viewport('macbook-15');
    cy.get('[data-cy=add-to-bag]').click();
    cy.get('[data-cy=my-cart-modal]').click();
    cy.contains('My Cart: (1) Item');
  });
});
