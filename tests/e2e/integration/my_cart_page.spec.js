describe('My Cart Page', () => {
  it('shows products in cart', () => {
    // cy.visit('/products-page');
    cy.getProducts();
    cy.wait(2000);
    cy.viewport('macbook-15');
    cy.get('[data-cy=catalog-item]')
      .first('[data-cy=catalog-item]')
      .click();
    cy.get('[data-cy=add-to-bag]').click();
    cy.get('[data-cy=my-cart-modal]').click();
    cy.get('[data-cy=item-count]');
  });

  it('can increase product in cart', () => {
    cy.viewport('macbook-15');
    cy.get('[data-cy=increase]').click();
    cy.contains('My Cart: (2) Items');
  });

  it('can decrease product in cart', () => {
    cy.viewport('macbook-15');
    cy.get('[data-cy=decrease]').click();
    cy.contains('My Cart: (1) Item');
  });

  it('can remove product in cart', () => {
    cy.viewport('macbook-15');
    cy.get('[data-cy=open-modal]').click();
    cy.get('[data-cy=remove]').click();
    cy.contains('Looks like there’s room for some products!');
  });
});
