describe("Flujo de creación y gestión de moodboards por color en SELEkT", () => {
  it("Sube imágenes, genera moodboards, baraja y elimina una foto", () => {
    // 1. Visitar la página de perfil y navegar a moodboards
    cy.visit("/profile");
    cy.wait(3000);
    cy.contains("Por Colores").click(); // Botón de moodboards

    cy.url().should("include", "/moodboards");

    // 2. Sube imágenes desde fixtures (img5 a img9)
    const files = Array.from({ length: 5 }, (_, i) => `img${i + 5}.jpg`);
    cy.get('input[type="file"]').selectFile(
      files.map((file) => `cypress/fixtures/${file}`),
      { action: "select", force: true }
    );

    // 3. Esperar a que se procesen las imágenes y aparezcan los moodboards
    cy.get(".album-card", { timeout: 90000 })
      .should("have.length.at.least", 1)
      .then(() => cy.wait(3000));

    // 4. Acceder al primer moodboard
    cy.get(".album-card").first().find(".cover").click();

    cy.url().should("include", "/moodboard/");
    cy.get(".photo", { timeout: 20000 }).should("have.length.at.least", 1);

    // 5. Pulsar el botón de barajar (shuffle) dos veces con pausas
    cy.get("button.shuffle-button").click();
    cy.wait(2000);
    cy.get("button.shuffle-button").click();
    cy.wait(2000);

    // 6. Abrir la primera imagen (modal)
    cy.get(".photo").first().click();
    cy.get(".modal-content img", { timeout: 10000 }).should("be.visible");
    cy.wait(1500);

    // 7. Pulsar el botón de eliminar
    cy.get("button.delete").click();

    // 8. Confirmar que el modal se cierra
    cy.get(".modal").should("not.exist");
  });
});
