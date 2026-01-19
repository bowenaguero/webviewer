#!/usr/bin/env node

/**
 * Build script for web worker
 * Bundles workers/history-parser/index.js to public/historyParser.worker.js
 */

import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

async function buildWorker() {
  try {
    const result = await build({
      entryPoints: [join(rootDir, 'workers/history-parser/index.js')],
      bundle: true,
      outfile: join(rootDir, 'public/historyParser.worker.js'),
      format: 'iife',
      target: ['es2020'],
      minify: process.env.NODE_ENV === 'production',
      sourcemap: process.env.NODE_ENV !== 'production',
      // Don't bundle external CDN scripts (loaded via importScripts)
      external: [],
      // Define to help with dead code elimination
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      },
      metafile: true,
    });

    // Log build info
    const outputSize = Object.values(result.metafile.outputs)[0].bytes;
    console.log(`✓ Worker built successfully (${(outputSize / 1024).toFixed(2)} KB)`);

    if (process.env.NODE_ENV !== 'production') {
      console.log('  Source map generated');
    }
  } catch (error) {
    console.error('✗ Worker build failed:', error.message);
    process.exit(1);
  }
}

buildWorker();
