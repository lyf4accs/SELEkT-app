describe("Login de usuario", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Muestra error si los campos están vacíos", () => {
    cy.get(".submit-button").click();
    cy.get(".error-message", { timeout: 4000 }).should(
      "contain",
      "Por favor, completa todos los campos."
    );
  });

  it("Muestra error si el correo tiene formato inválido", () => {
    cy.get("#email").type("correo_mal");
    cy.get("#password").type("password123");
    cy.get(".submit-button").click();

    cy.get(".error-message", { timeout: 4000 }).should(
      "contain",
      "Email o contraseña incorrectos"
    );
  });

  it("Muestra error si las credenciales son incorrectas", () => {
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 400,
      body: {
        error: "Invalid login credentials",
      },
    }).as("login");

    cy.get("#email").type("noexiste@example.com");
    cy.get("#password").type("contraseñaMala");
    cy.get(".submit-button").click();

    cy.wait("@login");
    cy.get(".error-message", { timeout: 4000 }).should(
      "contain",
      "Email o contraseña incorrectos"
    );
  });

  it("Login exitoso redirige a /upload", () => {
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 200,
      body: {
        access_token: "fake_token",
        user: { email: "javi@example.com" },
      },
    }).as("login");

    cy.get("#email").type("javi@example.com");
    cy.get("#password").type("password123");
    cy.get(".submit-button").click();

    cy.wait("@login");
    cy.url({ timeout: 8000 }).should("include", "/upload");
  });
});
