describe("Registro de usuario", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("Muestra error si faltan campos", () => {
    // Solo rellena un campo
    cy.get("#correo").type("javi@example.com");
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
    cy.get("#correo").type("javi@correo"); // inválido
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
    cy.get("#rep").type("diferente123");
    cy.get(".submit-button").click();
    cy.get(".error-message").should("contain", "Las contraseñas no coinciden");
  });

  it("Registra con éxito con datos válidos", () => {
    cy.intercept("POST", "**/auth/v1/signup", {
      statusCode: 200,
      body: {
        user: { email: "javi@example.com" },
        session: null,
      },
    }).as("signUp");

    cy.get("#nombre").type("Javier");
    cy.get("#correo").type("javi@example.com");
    cy.get("#password").type("password123");
    cy.get("#rep").type("password123");

    cy.get(".submit-button").click();
    cy.wait("@signUp");
    cy.get(".error-message").should("not.exist");
  });
});
