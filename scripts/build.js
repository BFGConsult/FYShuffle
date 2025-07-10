/**
 * FYShuffle Build Script
 *
 * This Node.js script assembles and outputs standalone JavaScript bundles for different environments:
 *
 * - browser (UMD-style):   dist/FYShuffle.js
 * - node (CommonJS):       dist/FYShuffle.node.js
 * - esm (ES Modules):      dist/FYShuffle.module.js
 *
 * Key Features:
 * - Assembles source files per target (defined in `sources`)
 * - Strips `import` and `export` lines while preserving function/const/class declarations
 * - Beautifies output using Prettier
 * - Minifies browser build using Terser (dist/FYShuffle.min.js)
 * - Supports CLI flags:
 *     --target=<name>   Build only a specific target (browser, node, esm)
 *     -v / --verbose    Show stripped import/export lines during build
 *
 * Usage:
 *   npm run build
 *   npm run build -- --target=node
 *   npm run build -- --target=browser --verbose
 *
 * Requires:
 *   - Node 16+
 *   - Installed dev dependencies:
 *       npm install --save-dev prettier terser
 */

import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import * as terser from 'terser';

const __dirname = path.resolve();
const distDir = path.join(__dirname, 'dist');

// Source files grouped by build target
const sources = {
  browser: [
    'src/fyshuffle-core.js',
    'src/core/base64.browser.js',
    'src/fyshuffle-crypto.js',
    'src/fyshuffle-dom.js',
  ],
  node: [
    'src/fyshuffle-core.js',
    'src/core/base64.node.js',
    'src/fyshuffle-crypto.js',
  ],
  esm: [
    'src/fyshuffle-core.js',
    'src/core/base64.browser.js',
    'src/fyshuffle-crypto.js',
  ],
};

// Output config per target
const targets = {
  browser: {
    out: 'FYShuffle.js',
    banner: '/* FYShuffle.js — browser (UMD-style) */',
  },
  node: {
    out: 'FYShuffle.node.js',
    banner: '/* FYShuffle — Node (CommonJS) */',
  },
  esm: {
    out: 'FYShuffle.module.js',
    banner: '/* FYShuffle — ES module */',
  },
};

// Parse CLI flags
const args = process.argv.slice(2);
const targetArg = args.find((arg) => arg.startsWith('--target='));
const onlyTarget = targetArg ? targetArg.split('=')[1] : null;
const isVerbose = args.includes('-v') || args.includes('--verbose');

// Helper to strip import/export lines and log them
function stripModuleSyntax(code, filePath) {
  return code
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('import')) {
        if (isVerbose)
          console.log(`⚠️  Stripped import from ${filePath}: ${trimmed}`);
        return null;
      }

      const exportMatch = trimmed.match(
        /^export\s+(function|const|let|var|class)\s/
      );
      if (exportMatch) {
        if (isVerbose)
          console.log(`⚠️  Removed 'export' from ${filePath}: ${trimmed}`);
        return line.replace(/^export\s+/, '');
      }

      if (trimmed.startsWith('export')) {
        if (isVerbose)
          console.log(`⚠️  Stripped export from ${filePath}: ${trimmed}`);
        return null;
      }

      return line;
    })
    .filter(Boolean)
    .join('\n');
}

async function buildTarget(targetKey) {
  const { out, banner } = targets[targetKey];
  const files = sources[targetKey];

  try {
    const contents = await Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(__dirname, file);
        const raw = await fs.readFile(fullPath, 'utf8');
        return stripModuleSyntax(raw, file);
      })
    );

    let combined = `${banner}\n\n${contents.join('\n\n')}`;

    // Add CommonJS export block for node
    if (targetKey === 'node') {
      combined += `\n\nmodule.exports = { FYForward, FYBackward, genPerm, nextRand };`;
    }
    if (targetKey === 'esm') {
      combined += `\n\nexport { FYForward, FYBackward, genPerm, nextRand };`;
    }

    const output = await prettier.format(combined, {
      parser: 'babel',
      semi: true,
      singleQuote: true,
    });

    const outputPath = path.join(distDir, out);
    await fs.mkdir(distDir, { recursive: true });
    await fs.writeFile(outputPath, output, 'utf8');
    console.log(`✔️  Built ${out}`);

    // Optional minification for browser
    if (targetKey === 'browser') {
      const minified = await terser.minify(combined);
      const minPath = path.join(distDir, 'FYShuffle.min.js');
      await fs.writeFile(minPath, minified.code, 'utf8');
      console.log(`✔️  Minified FYShuffle.min.js`);
    }

    return { target: targetKey, success: true };
  } catch (err) {
    console.error(`❌ Build failed for ${targetKey}: ${err.message}`);
    return { target: targetKey, success: false };
  }
}

async function buildAll() {
  const keysToBuild = onlyTarget
    ? Object.keys(targets).includes(onlyTarget)
      ? [onlyTarget]
      : (console.error(`❌ Unknown target: ${onlyTarget}`), process.exit(1))
    : Object.keys(targets);

  const results = await Promise.all(keysToBuild.map(buildTarget));

  const failed = results.filter((r) => !r.success);

  if (failed.length === 0) {
    console.log('✅ All builds completed successfully');
  } else {
    console.log('\n⚠️ Some builds failed:');
    failed.forEach((r) => console.log(` - ${r.target}`));
    process.exitCode = 1;
  }
}

buildAll();
