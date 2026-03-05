import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "vendor-react": ["react", "react-dom"],
          // Routing
          "vendor-router": ["react-router"],
          // Animation
          "vendor-framer": ["framer-motion"],

          // Three.js (heavy 3D lib)
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          // Radix UI components
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-tabs",
            "@radix-ui/react-slider",
            "@radix-ui/react-scroll-area",
          ],
        },
      },
    },
  },
});
