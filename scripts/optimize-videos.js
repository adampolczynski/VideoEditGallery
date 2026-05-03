import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const uploadsDir = path.resolve(rootDir, process.env.UPLOAD_DIR || 'uploads');
const dataDir = path.resolve(rootDir, process.env.DATA_DIR || 'data');
const videosFile = path.join(dataDir, 'videos.json');

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');

const options = {
  crf: process.env.VIDEO_OPTIMIZE_CRF || '22',
  preset: process.env.VIDEO_OPTIMIZE_PRESET || 'slow',
  maxWidth: process.env.VIDEO_OPTIMIZE_MAX_WIDTH || '1920',
  minSavingsRatio: Number(process.env.VIDEO_OPTIMIZE_MIN_SAVINGS || '0.04'),
};

const videoExtensions = new Set(['.mp4', '.mov', '.m4v', '.webm', '.ogg']);

const pathToUploadUrl = (filePath) => {
  const relative = path.relative(uploadsDir, filePath).split(path.sep).join('/');
  return `/uploads/${relative}`;
};

const uploadUrlToPath = (url) => {
  if (!url || !url.startsWith('/uploads/')) return null;
  return path.resolve(uploadsDir, url.replace(/^\/uploads\//, ''));
};

const optimizedPathFor = (filePath) => {
  const ext = path.extname(filePath);
  const base = filePath.slice(0, -ext.length);
  return `${base}.optimized.mp4`;
};

const getSize = (filePath) => fs.statSync(filePath).size;

const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const runFfmpeg = (inputPath, outputPath) => new Promise((resolve, reject) => {
  const ffmpegArgs = [
    '-y',
    '-i', inputPath,
    '-map', '0:v:0',
    '-map', '0:a?',
    '-vf', `scale=w='min(${options.maxWidth},iw)':h=-2:flags=lanczos`,
    '-c:v', 'libx264',
    '-preset', options.preset,
    '-crf', options.crf,
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    outputPath,
  ];

  const child = spawn('ffmpeg', ffmpegArgs, { stdio: ['ignore', 'ignore', 'pipe'] });
  let stderr = '';

  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  child.on('error', reject);
  child.on('close', (code) => {
    if (code === 0) {
      resolve();
      return;
    }

    reject(new Error(stderr || `ffmpeg exited with code ${code}`));
  });
});

const readVideos = () => {
  if (!fs.existsSync(videosFile)) return [];
  return JSON.parse(fs.readFileSync(videosFile, 'utf8'));
};

const collectFromVideosJson = (videos) => {
  const files = new Map();

  for (const video of videos) {
    for (const field of ['before_video', 'after_video']) {
      const filePath = uploadUrlToPath(video[field]);
      if (!filePath) continue;
      files.set(filePath, true);
    }
  }

  return [...files.keys()];
};

const collectFromUploads = () => {
  if (!fs.existsSync(uploadsDir)) return [];

  return fs.readdirSync(uploadsDir)
    .map((filename) => path.join(uploadsDir, filename))
    .filter((filePath) => fs.statSync(filePath).isFile())
    .filter((filePath) => videoExtensions.has(path.extname(filePath).toLowerCase()))
    .filter((filePath) => !filePath.includes('.optimized.'));
};

const updateVideosJson = (videos, replacements) => {
  let changed = false;
  const nextVideos = videos.map((video) => {
    const nextVideo = { ...video };

    for (const field of ['before_video', 'after_video']) {
      const replacement = replacements.get(video[field]);
      if (replacement) {
        nextVideo[field] = replacement;
        nextVideo.updated_at = new Date().toISOString();
        changed = true;
      }
    }

    return nextVideo;
  });

  if (!changed || dryRun) return changed;

  const backupFile = `${videosFile}.${new Date().toISOString().replace(/[:.]/g, '-')}.bak`;
  fs.copyFileSync(videosFile, backupFile);
  fs.writeFileSync(videosFile, `${JSON.stringify(nextVideos, null, 2)}\n`);
  console.log(`Updated data/videos.json. Backup: ${path.relative(rootDir, backupFile)}`);

  return changed;
};

const optimizeOne = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`Skip missing file: ${path.relative(rootDir, filePath)}`);
    return null;
  }

  const outputPath = optimizedPathFor(filePath);
  if (fs.existsSync(outputPath) && !force) {
    console.log(`Already optimized: ${path.relative(rootDir, outputPath)}`);
    return { sourceUrl: pathToUploadUrl(filePath), optimizedUrl: pathToUploadUrl(outputPath) };
  }

  const tempPath = `${outputPath}.tmp`;
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

  const inputSize = getSize(filePath);
  console.log(`Optimizing ${path.relative(rootDir, filePath)} (${formatSize(inputSize)})`);

  if (dryRun) {
    return { sourceUrl: pathToUploadUrl(filePath), optimizedUrl: pathToUploadUrl(outputPath) };
  }

  await runFfmpeg(filePath, tempPath);

  const outputSize = getSize(tempPath);
  const savingsRatio = 1 - (outputSize / inputSize);

  if (savingsRatio < options.minSavingsRatio) {
    fs.unlinkSync(tempPath);
    console.log(`Kept original, optimized copy saved too little (${formatSize(outputSize)}).`);
    return null;
  }

  fs.renameSync(tempPath, outputPath);
  console.log(`Wrote ${path.relative(rootDir, outputPath)} (${formatSize(outputSize)}, saved ${(savingsRatio * 100).toFixed(1)}%)`);

  return { sourceUrl: pathToUploadUrl(filePath), optimizedUrl: pathToUploadUrl(outputPath) };
};

const main = async () => {
  const videos = readVideos();
  const jsonFiles = collectFromVideosJson(videos);
  const files = jsonFiles.length > 0 ? jsonFiles : collectFromUploads();

  if (files.length === 0) {
    console.log('No local uploaded videos found to optimize.');
    return;
  }

  console.log(`Mode: ${dryRun ? 'dry run' : 'write'}`);
  console.log(`Quality: CRF ${options.crf}, preset ${options.preset}, max width ${options.maxWidth}px`);

  const replacements = new Map();

  for (const filePath of files) {
    const result = await optimizeOne(filePath);
    if (result) replacements.set(result.sourceUrl, result.optimizedUrl);
  }

  if (videos.length > 0 && replacements.size > 0) {
    updateVideosJson(videos, replacements);
  }

  console.log('Done.');
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
