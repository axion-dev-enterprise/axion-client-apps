import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: 'public',
  publicDir: false,
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        aluno: resolve(__dirname, 'public/aluno.html'),
        diagnostico: resolve(__dirname, 'public/diagnostico.html'),
        redacao: resolve(__dirname, 'public/redacao.html'),
        aula: resolve(__dirname, 'public/aula.html'),
        exercicios: resolve(__dirname, 'public/exercicios.html'),
        exercicio: resolve(__dirname, 'public/exercicio.html'),
        admin: resolve(__dirname, 'public/admin.html'),
        adminLogin: resolve(__dirname, 'public/admin-login.html'),
        editorAula: resolve(__dirname, 'public/editor-aula.html'),
        editorExercicio: resolve(__dirname, 'public/editor-exercicio.html'),
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
