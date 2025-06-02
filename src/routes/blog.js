const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// 获取所有博客列表
router.get('/api/blogs', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, image, tag, date FROM blog ORDER BY date DESC'
    );
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取博客列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取博客列表失败',
      error: error.message
    });
  }
});

// 获取特定ID的博客详情
router.get('/api/blogs/:id', async (req, res) => {
  const blogId = req.params.id;
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM blog WHERE id = ?',
      [blogId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${blogId}的博客`
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error(`获取博客 ${blogId} 详情失败:`, error);
    res.status(500).json({
      success: false,
      message: '获取博客详情失败',
      error: error.message
    });
  }
});

// 根据标签筛选博客
router.get('/api/blogs/tag/:tag', async (req, res) => {
  const tag = req.params.tag;
  
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, image, tag, date FROM blog WHERE tag = ? ORDER BY date DESC',
      [tag]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error(`获取标签 ${tag} 的博客失败:`, error);
    res.status(500).json({
      success: false,
      message: '获取博客列表失败',
      error: error.message
    });
  }
});

// 搜索博客
router.get('/api/blogs/search/:query', async (req, res) => {
  const searchQuery = req.params.query;
  
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, image, tag, date FROM blog WHERE title LIKE ? OR description LIKE ? ORDER BY date DESC',
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error(`搜索博客 "${searchQuery}" 失败:`, error);
    res.status(500).json({
      success: false,
      message: '搜索博客失败',
      error: error.message
    });
  }
});

module.exports = router; 