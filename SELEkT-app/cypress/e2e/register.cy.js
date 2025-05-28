describe("Registro de usuario", () => {
  beforeEach(() => {
    cy.visit("/register"); // Asegúrate que esta ruta es la correcta
  });

  it("Muestra error si faltan campos", () => {
    cy.get("#nombre").type("Javier");
    cy.get("#correo").type("javi@example.com");
    // Faltan contraseñas

    cy.get(".submit-button").click();
    cy.get(".error-message").should("contain", "Rellena todos los campos");
  });

  it("Muestra error si el nombre tiene números", () => {
    cy.get("#nombre").type("Javi123");
    cy.get("#correo").type("javi@example.com");
    cy.get("#password").type("password123");
    cy.get("#rep").type("password123");

    cy.get(".submit-button").click();
    cy.get(".error-message").should(
      "contain",
      "Escribe un nombre sin digitos y sin más de 50 caracteres."
    );
  });

  it("Muestra error si los emails son inválidos", () => {
    cy.get("#nombre").type("Javier");
    cy.get("#correo").type("javi@correo"); // Mal formado
    cy.get("#password").type("password123");
    cy.get("#rep").type("password123");

    cy.get(".submit-button").click();
    cy.get(".error-message").should(
      "contain",
      "Email incorrecto. Escribe un email válido"
    );
  });

  it("Muestra error si las contraseñas no coinciden", () => {
    cy.get("#nombre").type("Javier");
    cy.get("#correo").type("javi@example.com");
    cy.get("#password").type("password123");
    cy.get("#rep").type("password456");

    cy.get(".submit-button").click();
    cy.get(".error-message").should("contain", "Las contraseñas no coinciden");
  });

  it("Registra con éxito con datos válidos", () => {
    cy.intercept("POST", "**/auth/**", {
      statusCode: 200,
      body: { success: true },
    }).as("registerRequest");

    cy.get("#nombre").type("Javier");
    cy.get("#correo").type("javi@example.com");
    cy.get("#password").type("password123");
    cy.get("#rep").type("password123");

    cy.get(".submit-button").click();

    // Espera redirección o confirmación
    cy.wait("@registerRequest");
    // Alternativa: verifica que no hay error
    cy.get(".error-message").should("not.exist");
    // O redirección esperada:
    cy.url().should("not.include", "/register");
  });
});
