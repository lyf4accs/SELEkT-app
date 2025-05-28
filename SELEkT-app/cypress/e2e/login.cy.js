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

  it("Muestra error si las credenciales son incorrectas (mock)", () => {
    // Simulamos que signInUser devuelve false sin llamar a Supabase
    cy.window().then((win) => {
      cy.stub(win, "fetch").resolves({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid login credentials" }),
      });
    });

    cy.get("#email").type("noexiste@example.com");
    cy.get("#password").type("contraseñaMala");
    cy.get(".submit-button").click();

    cy.get(".error-message", { timeout: 4000 }).should(
      "contain",
      "Email o contraseña incorrectos"
    );
  });

  it("Login exitoso simulado redirige a /upload y no hay mensaje de error", () => {
    // Simulamos que signInUser devuelve true
    cy.window().then((win) => {
      cy.stub(win.supabaseClient.auth, "signInWithPassword").resolves({
        data: { user: { email: "javi@example.com" } },
        error: null,
      });
    });

    cy.get("#email").type("javi@example.com");
    cy.get("#password").type("password123");
    cy.get(".submit-button").click();

    cy.url({ timeout: 8000 }).should("include", "/upload");
    cy.get(".error-message").should("not.exist");
  });
});
