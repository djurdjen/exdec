describe("Login page", () => {
  it("Logs in succesfully", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: "/api/login"
    }).as("loginCheck");

    cy.visit("http://localhost:3000/login");
    cy.get('form input[type="email"]').type("admin@admin.nl");
    cy.get('form input[type="password"]').type("admin");
    cy.get('form button[type="submit"]').click();
    cy.wait("@loginCheck").then(xhr => {
      const resp = xhr.response.body;
      assert.equal(resp.message, "success");
    });
  });
  it("Add new entry", () => {
    cy.get('.create__form input[name="description"]').type("Test");
    cy.get('.create__form select[name="transport-type"]').select("metro");
    cy.get('.create__form input[name="ticket-price"]').type("19.50");
    cy.get('button[name="send-entry"]').click();
  });

  it("Remove new entry", () => {
    cy.get(".entries__single")
      .first()
      .click();
    cy.get(".entries__delete").click();
    cy.get('.modal__prompt button[name="action-btn"]').click();
  });
});
