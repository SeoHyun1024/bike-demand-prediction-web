import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/bike-demand-prediction-web/", // 예: '/bike-demand-prediction-web/'
});
