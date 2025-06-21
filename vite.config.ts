import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/doesinger-app/",
  build: {
    outDir: "docs",
  },
  plugins: [react()],
});

