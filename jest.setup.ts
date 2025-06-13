import "@testing-library/jest-dom";

if (typeof window === "undefined") {
  (global as any).import = {
    meta: {
      env: {
        VITE_ENCRYPTION_KEY: "mocked-encryption-key",
        // Add other environment variables as needed
      },
    },
  };
}
