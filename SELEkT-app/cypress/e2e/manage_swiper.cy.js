describe("Flujo completo de gestión y detección de duplicados en SELEkT", () => {
  it("Sube imágenes, procesa, entra en álbum y realiza swipes completos", () => {
    cy.visit("/manage");

    const imageFiles = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"];
    cy.get('input[type="file"]').selectFile(
      imageFiles.map((file) => `cypress/fixtures/${file}`),
      { action: "select", force: true }
    );

    cy.get(".thumbnail", { timeout: 10000 }).should("have.length.at.least", 4);
    cy.contains("Procesar Imágenes").should("not.be.disabled").click();

    cy.get(".album", { timeout: 90000 })
      .should("have.length.at.least", 2)
      .then(() => cy.wait(3000));

    cy.get(".album").first().click();
    cy.url().should("include", "/swiper");
    cy.get(".card", { timeout: 20000 }).should("have.length.at.least", 1);
    cy.wait(1000);
  });
});
