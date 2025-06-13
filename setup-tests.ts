import { vi } from "vitest";

vi.mock("vite", () => ({
  defineConfig: vi.fn(),
}));

if (typeof window === "undefined") {
  vi.stubGlobal("import.meta", { env: {} });
}
