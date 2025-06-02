const express = require('express');
const router = express.Router();
const { testConnection } = require('../config/db');

router.get('/test', async (req, res) => {
    res.write("hello");
    res.end();
});

// 测试数据库连接的接口
router.get('/api/test-db-connection', async (req, res) => {
    try {
        const result = await testConnection();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
            error: error.message
        });
    }
});

module.exports = router; 