describe("Gestión de álbumes compartidos – Verificación precisa por fecha", () => {
  it("Sube imágenes, crea un álbum y accede al enlace generado más reciente", () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const formattedDate = `${pad(now.getDate())}/${pad(
      now.getMonth() + 1
    )}/${now.getFullYear().toString().slice(-2)}`;
    const formattedTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    cy.visit("/upload");

    const files = ["img6.jpg", "img7.jpg", "img8.jpg"];
    cy.get("button.add-button").click();
    cy.get('input[type="file"]').selectFile(
      files.map((file) => `cypress/fixtures/${file}`),
      { action: "select", force: true }
    );

    cy.get(".preview-img", { timeout: 10000 }).should(
      "have.length.at.least",
      3
    );
    cy.wait(1000);

    cy.get("button.upload-button").should("not.be.disabled").click();
    cy.on("window:confirm", () => true);

    // Aumentamos tiempo de espera tras la subida
    cy.wait(6000);

    cy.visit("/profile");
    cy.contains("Mis Links").click();
    cy.url().should("include", "/links");

    // Esperar a que carguen todos los album-cards
    cy.get(".album-card", { timeout: 30000 }).should("have.length.at.least", 1);

    // Buscar el álbum por fecha y hora
    cy.get(".album-card").each(($card) => {
      cy.wrap($card)
        .scrollIntoView()
        .within(() => {
          cy.get(".album-date")
            .invoke("text")
            .then((text) => {
              if (
                text.includes(formattedDate) &&
                text.includes(formattedTime)
              ) {
                cy.get("a.album-link").click();
              }
            });
        });
    });

    cy.url({ timeout: 10000 }).should("include", "/album/");
  });
});
