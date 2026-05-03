import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', process.env.DATA_DIR || 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const videosFile = path.join(dataDir, 'videos.json');
const settingsFile = path.join(dataDir, 'settings.json');

// Initialize files if they don't exist
const initializeFiles = () => {
  if (!fs.existsSync(videosFile)) {
    fs.writeFileSync(videosFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(settingsFile, JSON.stringify({
      autoScroll: false,
      autoScrollInterval: 5000
    }, null, 2));
  }
};

initializeFiles();

// Videos operations
export const videos = {
  getAll: () => {
    const data = fs.readFileSync(videosFile, 'utf-8');
    return JSON.parse(data);
  },

  getById: (id) => {
    const allVideos = videos.getAll();
    return allVideos.find(v => v.id === parseInt(id));
  },

  create: (video) => {
    const allVideos = videos.getAll();
    const newId = allVideos.length > 0 ? Math.max(...allVideos.map(v => v.id)) + 1 : 1;
    const newVideo = {
      id: newId,
      ...video,
      order_index: allVideos.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    allVideos.push(newVideo);
    fs.writeFileSync(videosFile, JSON.stringify(allVideos, null, 2));
    return newVideo;
  },

  update: (id, updates) => {
    const allVideos = videos.getAll();
    const index = allVideos.findIndex(v => v.id === parseInt(id));
    if (index === -1) throw new Error('Video not found');
    allVideos[index] = {
      ...allVideos[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    fs.writeFileSync(videosFile, JSON.stringify(allVideos, null, 2));
    return allVideos[index];
  },

  delete: (id) => {
    const allVideos = videos.getAll();
    const filtered = allVideos.filter(v => v.id !== parseInt(id));
    fs.writeFileSync(videosFile, JSON.stringify(filtered, null, 2));
  },

  reorder: (order) => {
    const allVideos = videos.getAll();
    order.forEach((item, index) => {
      const video = allVideos.find(v => v.id === item.id);
      if (video) video.order_index = index + 1;
    });
    fs.writeFileSync(videosFile, JSON.stringify(allVideos, null, 2));
  }
};

// Settings operations
export const settings = {
  getAll: () => {
    const data = fs.readFileSync(settingsFile, 'utf-8');
    return JSON.parse(data);
  },

  update: (key, value) => {
    const allSettings = settings.getAll();
    allSettings[key] = value;
    fs.writeFileSync(settingsFile, JSON.stringify(allSettings, null, 2));
    return allSettings;
  }
};

export default { videos, settings };
