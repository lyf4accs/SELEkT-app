import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', // o tu URL de despliegue
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 400,
    viewportHeight: 841,
  },
});
