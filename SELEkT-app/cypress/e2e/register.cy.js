describe("Registro de usuario", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("Muestra error si faltan campos", () => {
    // No se rellena nada
    cy.get(".submit-button").click();
    cy.get(".error-message", { timeout: 4000 }).should(
      "contain",
      "Rellena todos los campos"
    );
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

  it("Muestra error si el correo es inválido", () => {
    cy.get("#nombre").type("Javier");
    cy.get("#correo").type("correo@invalido"); // sin dominio
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
    cy.get("#rep").type("otra1234");
    cy.get(".submit-button").click();
    cy.get(".error-message").should("contain", "Las contraseñas no coinciden");
  });

  it("Muestra error si el correo ya está registrado", () => {
    cy.intercept("POST", "**/auth/v1/signup", {
      statusCode: 400,
      body: {
        error: "Correo a registrado",
      },
    }).as("signUp");

    cy.get("#nombre").type("Javier");
    cy.get("#correo").type("javi@example.com");
    cy.get("#password").type("password123");
    cy.get("#rep").type("password123");
    cy.get(".submit-button").click();

    cy.wait("@signUp");
    cy.get(".error-message", { timeout: 4000 }).should(
      "contain",
      "Correo a registrado"
    );
  });

  it("Registra con éxito con datos válidos", () => {
    const email = `javi${Date.now()}@example.com`;

    cy.intercept("POST", "**/auth/v1/signup", {
      statusCode: 200,
      body: {
        user: { email },
        session: null,
      },
    }).as("signUp");

    cy.get("#nombre").type("Javier");
    cy.get("#correo").type(email);
    cy.get("#password").type("password123");
    cy.get("#rep").type("password123");
    cy.get(".submit-button").click();

    cy.wait("@signUp");
    cy.get(".error-message").should("not.exist");
  });
});
