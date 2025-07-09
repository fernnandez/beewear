import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    watch: {
      ignored: ["**/node_modules/**", "**/dist/**"],
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          mantine: ["@mantine/core", "@mantine/hooks"],
          icons: ["@tabler/icons-react"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@services": path.resolve(__dirname, "src/services"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@localTypes": path.resolve(__dirname, "src/types"),
    },
  },
});
