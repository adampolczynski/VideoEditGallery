/**
 * Sample data initialization script
 * Run this to populate the database with sample videos
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/portfolio.db');

const db = new Database(dbPath);

// Clear existing videos
db.prepare('DELETE FROM videos').run();

// Insert sample videos
const samples = [
  {
    title: 'Fitness Transformation',
    description: 'Amazing 90-day fitness journey with dedicated training',
    before_video: '/uploads/sample-before-1.mp4',
    after_video: '/uploads/sample-after-1.mp4',
    order_index: 1
  },
  {
    title: 'Home Renovation',
    description: 'Complete kitchen and living room makeover',
    before_video: '/uploads/sample-before-2.mp4',
    after_video: '/uploads/sample-after-2.mp4',
    order_index: 2
  },
  {
    title: 'Car Detail',
    description: 'Professional deep clean and detailing service',
    before_video: '/uploads/sample-before-3.mp4',
    after_video: '/uploads/sample-after-3.mp4',
    order_index: 3
  }
];

const stmt = db.prepare(`
  INSERT INTO videos (title, description, before_video, after_video, order_index)
  VALUES (?, ?, ?, ?, ?)
`);

samples.forEach(video => {
  stmt.run(video.title, video.description, video.before_video, video.after_video, video.order_index);
});

console.log('✅ Sample data inserted successfully!');
console.log('📝 Add your own videos in the admin panel or replace the URLs');

db.close();
