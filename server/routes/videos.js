import express from 'express';
import { verifyAdmin } from '../middleware/auth.js';
import { videos } from '../storage.js';

const router = express.Router();

// Get all videos
router.get('/', (req, res) => {
  try {
    const allVideos = videos.getAll();
    res.json(allVideos.sort((a, b) => a.order_index - b.order_index));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single video
router.get('/:id', (req, res) => {
  try {
    const video = videos.getById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create video (admin only)
router.post('/', verifyAdmin, (req, res) => {
  try {
    const { title, description, before_video, after_video } = req.body;

    if (!title || !before_video || !after_video) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newVideo = videos.create({
      title,
      description: description || '',
      before_video,
      after_video
    });

    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update video (admin only)
router.put('/:id', verifyAdmin, (req, res) => {
  try {
    const { title, description, before_video, after_video, order_index } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (before_video !== undefined) updates.before_video = before_video;
    if (after_video !== undefined) updates.after_video = after_video;
    if (order_index !== undefined) updates.order_index = order_index;

    const updated = videos.update(req.params.id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete video (admin only)
router.delete('/:id', verifyAdmin, (req, res) => {
  try {
    videos.delete(req.params.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reorder videos (admin only)
router.post('/reorder', verifyAdmin, (req, res) => {
  try {
    const { order } = req.body;
    videos.reorder(order);
    res.json({ success: true, message: 'Videos reordered' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
