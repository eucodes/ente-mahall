import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import swc from "unplugin-swc";

export default defineConfig({
  // NestJS's constructor-injection DI relies on TypeScript's
  // emitDecoratorMetadata, which esbuild (vitest's default transform) does
  // not emit. swc does, so we use it here instead — see
  // https://docs.nestjs.com/recipes/swc#vitest
  plugins: [tsconfigPaths(), swc.vite()],
  test: {
    include: ["src/**/*.spec.ts"],
    environment: "node",
    globals: true
  }
});
