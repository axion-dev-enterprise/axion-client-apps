import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function getHtmlInputs(dir, baseDir) {
  let inputs = {};
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'assets') {
        Object.assign(inputs, getHtmlInputs(fullPath, baseDir));
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const key = relPath.replace(/\.html$/, '').replace(/\//g, '_');
      inputs[key] = fullPath;
    }
  }
  return inputs;
}

const publicRoot = resolve(__dirname, 'public');
const htmlInputs = getHtmlInputs(publicRoot, publicRoot);

export default defineConfig({
  root: 'public',
  publicDir: false,
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: htmlInputs
    }
  },
  server: {
    port: 5173
  }
});
