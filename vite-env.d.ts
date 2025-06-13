interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
  interface ImportMetaEnv {
    readonly VITE_ENCRYPTION_KEY: string;
    // Add other environment variables as needed
  }