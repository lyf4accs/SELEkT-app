describe("Login de usuario – Validación de errores y login real", () => {
  beforeEach(() => {
    cy.visit("/login");
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

  it("Muestra error si las credenciales son incorrectas (simulado)", () => {
    cy.get("#email").type("noexiste@example.com");
    cy.get("#password").type("claveincorrecta");
    cy.get(".submit-button").click();

    cy.get(".error-message", { timeout: 4000 }).should(
      "contain",
      "Email o contraseña incorrectos"
    );
  });

  it("Login válido con usuario real redirige a /upload", () => {
    cy.get("#email").type("pyroolatorre@gmail.com");
    cy.get("#password").type("J2003avier");
    cy.get(".submit-button").click();

    // Confirmamos redirección tras login exitoso
    cy.url({ timeout: 8000 }).should("include", "/upload");
    cy.get(".error-message").should("not.exist");
  });
});
