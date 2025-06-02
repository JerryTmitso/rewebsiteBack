const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { videoResourceLimiter, apiLimiter } = require('../middleware/rateLimit');

// 获取所有资源列表
router.get('/api/resources', apiLimiter, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resources ORDER BY date DESC'
    );
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取资源列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取资源列表失败',
      error: error.message
    });
  }
});

// 根据类型获取资源
router.get('/api/resources/type/:type', apiLimiter, async (req, res) => {
  const resourceType = req.params.type;
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resources WHERE type = ? ORDER BY date DESC',
      [resourceType]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error(`获取类型 ${resourceType} 的资源失败:`, error);
    res.status(500).json({
      success: false,
      message: '获取资源列表失败',
      error: error.message
    });
  }
});

// 搜索资源
router.get('/api/resources/search/:query', apiLimiter, async (req, res) => {
  const searchQuery = req.params.query;
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resources WHERE title LIKE ? OR description LIKE ? ORDER BY date DESC',
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error(`搜索资源 "${searchQuery}" 失败:`, error);
    res.status(500).json({
      success: false,
      message: '搜索资源失败',
      error: error.message
    });
  }
});

// 获取视频资源
router.get('/api/resources/videos', videoResourceLimiter, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resources WHERE type = "video" ORDER BY date DESC'
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取视频资源失败:', error);
    res.status(500).json({
      success: false,
      message: '获取视频资源失败',
      error: error.message
    });
  }
});

// 获取文档资源（白皮书和报告）
router.get('/api/resources/documents', apiLimiter, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resources WHERE type IN ("whitepaper", "report") ORDER BY date DESC'
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取文档资源失败:', error);
    res.status(500).json({
      success: false,
      message: '获取文档资源失败',
      error: error.message
    });
  }
});

// 获取单个资源详情
router.get('/api/resources/:id', apiLimiter, async (req, res) => {
  const resourceId = req.params.id;
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resources WHERE id = ?',
      [resourceId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${resourceId}的资源`
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error(`获取资源 ${resourceId} 详情失败:`, error);
    res.status(500).json({
      success: false,
      message: '获取资源详情失败',
      error: error.message
    });
  }
});

module.exports = router; 