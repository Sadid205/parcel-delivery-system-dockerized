import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const allowedHosts = env.VITE_ALLOWED_HOSTS
    ? env.VITE_ALLOWED_HOSTS.split(",")
    : ["parcel-delivery-system.mdabdullahalsadid.com"];
  const port = env.PORT ? parseInt(env.PORT) : 4173;
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      allowedHosts: allowedHosts,
      host: "0.0.0.0",
      port: port,
      strictPort: true,
    },
    preview: {
      allowedHosts: allowedHosts,
      host: "0.0.0.0",
      port: port,
      strictPort: true,
    },
  };
});
