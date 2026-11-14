const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const args = process.argv.slice(2);
  if (args[0] === '--help') {
    console.log('Usage: node main.ts [--help]');
    process.exit(0);
  }

  const src = path.join(__dirname, 'entry.png');
  try {
    await fs.stat(src);
  } catch (err) {
    console.error('entry.png not found in', __dirname);
    process.exit(1);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  await fs.mkdir(outDir, { recursive: true });
  const dest = path.join(outDir, 'entry.png');
  await fs.copyFile(src, dest);
  const srcStat = await fs.stat(src);
  const destStat = await fs.stat(dest);
  if (srcStat.size !== destStat.size) {
    console.error(`size mismatch: source ${srcStat.size} != dest ${destStat.size}`);
    process.exit(1);
  }
  if (!destStat.isFile()) {
    console.error(`destination is not a regular file: ${dest}`);
    process.exit(1);
  }
  console.log(`wrote ${dest} (${destStat.size} bytes)`);
})();
