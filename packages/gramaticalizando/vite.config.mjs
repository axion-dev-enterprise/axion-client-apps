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
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'assets' && entry.name !== 'legacy') {
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

// Plugin para espelhar páginas de pages/*.html na raiz de dist/ para Clean URLs perfeitas
function cleanUrlsMirrorPlugin() {
  return {
    name: 'clean-urls-mirror',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      const pagesDir = path.join(distDir, 'pages');
      if (fs.existsSync(pagesDir)) {
        const files = fs.readdirSync(pagesDir);
        for (const file of files) {
          if (file.endsWith('.html') && file !== 'index.html') {
            const srcPath = path.join(pagesDir, file);
            const dstPath = path.join(distDir, file);
            let content = fs.readFileSync(srcPath, 'utf-8');
            // Ajustar caminhos de ../assets/ para ./assets/ ou /assets/
            content = content.replace(/(href|src)=["']\.\.\/assets\//g, '$1="/assets/');
            fs.writeFileSync(dstPath, content, 'utf-8');
            console.log(`[clean-urls-mirror] Mirrored pages/${file} -> ${file}`);
          }
        }
      }
    }
  };
}

export default defineConfig({
  root: 'public',
  publicDir: false,
  plugins: [cleanUrlsMirrorPlugin()],
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
