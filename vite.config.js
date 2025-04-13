import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@client": "/src/client",
      "@contexts": "/src/contexts",
      "@middlewares": "/src/middlewares",
      "@components": "/src/components",
      "@helpers": "/src/helpers",
      "@css": "/src/css",
      "@images": "/src/images",
      "@pages": "/src/pages",
      "@Admin": "/src/pages/Admin",
      "@Vendor": "/src/pages/Vendor",
      "@Customer": "/src/pages/Customer",
    },
  },
  build: {
    cssCodeSplit: true,
  },
});
