const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置文件上传
const uploadDir = path.join(__dirname, '../../uploads');

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, 'document-' + uniqueSuffix + fileExt);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型。请上传PDF、Word或文本文件。'), false);
  }
};

// 创建上传中间件
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB大小限制
  }
});

// 处理提交的联系表单
router.post('/api/pricing/contact', upload.single('document'), async (req, res) => {
  try {
    const {
      name,
      phone,
      company,
      email,
      position,
      scale,
      cloudProvider,
      dataSize,
      module,
      description,
      selectedType,
      selectedRegion,
      instanceCount,
      storage,
      billingType,
      estimatedPrice
    } = req.body;
    
    // 验证必填字段
    if (!name || !phone || !company || !position) {
      return res.status(400).json({
        success: false,
        message: '请填写所有必填字段'
      });
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '请输入有效的手机号码'
      });
    }
    
    // 验证邮箱格式
    const emailRegex = /\S+@\S+\.\S+/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '请输入有效的邮箱地址'
      });
    }
    
    // 准备文件路径
    let documentPath = null;
    if (req.file) {
      documentPath = req.file.path;
    }
    
    // 将数据插入数据库
    const [result] = await pool.query(
      `INSERT INTO pricing_contacts (
        name, phone, company, email, position, scale, 
        cloud_provider, data_size, module, description,
        selected_type, selected_region, instance_count, storage,
        billing_type, estimated_price, document_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, phone, company, email, position, scale,
        cloudProvider, dataSize, module, description,
        selectedType, selectedRegion, instanceCount, storage,
        billingType, estimatedPrice, documentPath
      ]
    );
    
    res.json({
      success: true,
      message: '表单提交成功，我们将尽快与您联系',
      id: result.insertId
    });
  } catch (error) {
    console.error('提交联系表单失败:', error);
    res.status(500).json({
      success: false,
      message: '提交失败，请稍后重试',
      error: error.message
    });
  }
});

module.exports = router; 