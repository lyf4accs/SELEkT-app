describe("Configuración – Validación del modo oscuro y acceso a galería en SELEkT", () => {
  beforeEach(() => {
    cy.visit("/config");
  });

  it("Activa/desactiva modo oscuro y comprueba acceso a galería en otra vista", () => {
    //  Asegura que se inicia en modo claro
    cy.get("body").should("not.have.class", "dark-mode");

    // Activa el modo oscuro
    cy.get(".switch input[type='checkbox']").eq(1).check({ force: true });
    cy.get("body").should("have.class", "dark-mode");
    cy.get(".upload-container")
      .should("have.css", "background-color")
      .and("match", /rgb\(13,\s*17,\s*23\)/);
    cy.wait(1500);

    // Ir atrás
    cy.get("button.back").click();
    cy.url().should("not.include", "/config");
    cy.wait(1500);

    // Volver a configuración y verificar que persiste
    cy.visit("/config");
    cy.get("body").should("have.class", "dark-mode");

    // Desactiva el modo oscuro
    cy.get(".switch input[type='checkbox']").eq(1).uncheck({ force: true });
    cy.get("body").should("not.have.class", "dark-mode");
    cy.get(".upload-container")
      .should("have.css", "background-color")
      .and("match", /rgb\(4,\s*25,\s*41\)/);
    cy.wait(1500);

    // Ir atrás y volver para confirmar que sigue en claro
    cy.get("button.back").click();
    cy.url().should("not.include", "/config");
    cy.visit("/config");
    cy.get("body").should("not.have.class", "dark-mode");

    // Validar estado inicial del slider de galería (desactivado)
    cy.get(".switch input[type='checkbox']").eq(0).uncheck({ force: true }); // Forzar desactivado
    cy.wait(1000);

    // Ir a /moodboards e intentar usar el botón seleccionar imágenes sin permiso
    cy.visit("/moodboards");
    cy.get(".moodboard-container").should("exist");
    cy.get(".upload-button button").should("be.visible").click();

    // Debería mostrar una alerta (galería denegada)
    cy.on("window:alert", (str) => {
      expect(str).to.include("permiso"); // o mensaje definido
    });

    cy.wait(1000);

    // Volver a /config y activar galería
    cy.visit("/config");
    cy.get(".switch input[type='checkbox']").eq(0).check({ force: true });
    cy.wait(1000);

    // Volver a comprobar que ahora sí deja abrir selector
    cy.visit("/moodboards");
    cy.get(".moodboard-container").should("exist");
    cy.get(".upload-button button").should("be.visible").click();

    // Debe haber un input de tipo file visible y funcional
   cy.get('input[type="file"]').then(($input) => {
     const input = $input[0];
     cy.wrap(input).invoke("click"); // Esto debe ejecutarse sin alertas ni errores
   });

   // No debe saltar ninguna alerta si el permiso está activado
   cy.on("window:alert", () => {
     throw new Error(
       "No debería saltar una alerta si el acceso está habilitado."
     );
   });
  });
});
