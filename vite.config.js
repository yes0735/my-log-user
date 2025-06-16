import { defineConfig, loadEnv } from "vite"
import process from 'node:process'
import vue from "@vitejs/plugin-vue"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return {
    define: {
      VITE_SERVICE_TITLE: JSON.stringify(env.VITE_APP_TITLE),
      VITE_DEFAULT_API_URL: JSON.stringify(env.VITE_APP_DEFAULT_API_URL),
      VITE_MASTER_API_URL: JSON.stringify(env.VITE_APP_MASTER_API_URL),
      VITE_USER_API_URL: JSON.stringify(env.VITE_APP_USER_API_URL),
      'process.env': {},
      'window.global': {},
    },
    plugins: [vue()],
    resolve: {
      alias: [{ find: "@", replacement: "/src" }],
    },
  }
})
