const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// 导入敏感词过滤中间件
const { sensitiveWordFilterMiddleware, SensitivityLevel } = require('../middleware/sensitiveWordFilter');
const logger = require('../utils/logger');

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
    cb(null, 'contact-' + uniqueSuffix + fileExt);
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

// 创建contacts表结构的SQL（如果需要）
const createContactsTableSQL = `
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '联系人姓名',
  phone VARCHAR(20) NOT NULL COMMENT '手机号码',
  company VARCHAR(255) NOT NULL COMMENT '公司名称',
  email VARCHAR(255) COMMENT '企业邮箱',
  position VARCHAR(100) NOT NULL COMMENT '职位',
  scale VARCHAR(50) COMMENT '企业规模',
  cloud_provider VARCHAR(100) COMMENT '目前使用的云服务商',
  data_size VARCHAR(50) COMMENT '数据规模',
  module VARCHAR(50) COMMENT '关注的模块',
  description TEXT COMMENT '需求描述',
  document_path VARCHAR(255) COMMENT '上传文件路径',
  contains_sensitive_words BOOLEAN DEFAULT FALSE COMMENT '是否包含敏感词',
  sensitivity_level VARCHAR(10) COMMENT '敏感词级别: low, medium, high',
  detected_words TEXT COMMENT '检测到的敏感词',
  filtered_fields TEXT COMMENT '包含敏感词的字段',
  client_ip VARCHAR(50) COMMENT '客户端IP地址',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

// 定义需要过滤敏感词的字段
const fieldsToFilter = [
  'name', 
  'company', 
  'position', 
  'scale', 
  'cloudProvider', 
  'module', 
  'description'
];

// 应用敏感词过滤中间件
const sensitiveWordFilter = sensitiveWordFilterMiddleware(fieldsToFilter);

// 处理提交的联系表单 - 添加敏感词过滤中间件
router.post('/api/contact', upload.single('document'), sensitiveWordFilter, async (req, res) => {
  // 获取客户端IP
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  try {
    // 创建contacts表（如果不存在）
    await pool.query(createContactsTableSQL);
    
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
      description
    } = req.body;
    
    // 验证必填字段
    if (!name || !phone || !company || !position) {
      await logger.warning('联系表单缺少必填字段', { 
        ip: clientIp,
        missingFields: [
          !name && 'name',
          !phone && 'phone',
          !company && 'company',
          !position && 'position'
        ].filter(Boolean)
      });
      
      return res.status(400).json({
        success: false,
        message: '请填写所有必填字段'
      });
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (phone && !phoneRegex.test(phone)) {
      await logger.warning('提交了无效的手机号', { ip: clientIp, phone });
      
      return res.status(400).json({
        success: false,
        message: '请输入有效的手机号码'
      });
    }
    
    // 验证邮箱格式
    const emailRegex = /\S+@\S+\.\S+/;
    if (email && !emailRegex.test(email)) {
      await logger.warning('提交了无效的邮箱', { ip: clientIp, email });
      
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
    
    // 敏感词信息处理
    let sensitivityLevel = null;
    let detectedWordsJson = null;
    let filteredFieldsJson = null;
    
    if (req.containsSensitiveWords && req.sensitiveWordsInfo) {
      sensitivityLevel = req.sensitiveWordsInfo.highestLevel;
      detectedWordsJson = JSON.stringify(req.sensitiveWordsInfo.detectedWords);
      filteredFieldsJson = JSON.stringify(Object.keys(req.sensitiveWordsInfo.filteredFields));
    }
    
    // 将数据插入数据库，包括敏感词标记
    const [result] = await pool.query(
      `INSERT INTO contacts (
        name, phone, company, email, position, scale, 
        cloud_provider, data_size, module, description, document_path, 
        contains_sensitive_words, sensitivity_level, detected_words, filtered_fields, client_ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, phone, company, email, position, scale,
        cloudProvider, dataSize, module, description, documentPath, 
        req.containsSensitiveWords ? 1 : 0,  // 是否包含敏感词
        sensitivityLevel,                     // 敏感度级别
        detectedWordsJson,                    // 检测到的敏感词
        filteredFieldsJson,                   // 包含敏感词的字段
        clientIp                              // 客户端IP
      ]
    );
    
    // 记录表单提交成功日志
    await logger.info('联系表单提交成功', {
      ip: clientIp,
      contactId: result.insertId,
      containsSensitiveWords: req.containsSensitiveWords || false
    });
    
    // 如果包含高级别敏感词，可能需要进一步人工审核
    if (req.containsSensitiveWords && 
        req.sensitiveWordsInfo && 
        req.sensitiveWordsInfo.highestLevel === SensitivityLevel.HIGH) {
      await logger.security('检测到高级别敏感内容，需要人工审核', {
        ip: clientIp,
        contactId: result.insertId,
        detectedWords: req.sensitiveWordsInfo.detectedWords
      });
    }
    
    // 根据敏感词级别返回不同的响应
    if (req.containsSensitiveWords) {
      // 高级别敏感词
      if (req.sensitiveWordsInfo.highestLevel === SensitivityLevel.HIGH) {
        return res.json({
          success: true,
          message: '表单提交成功，您的请求将在审核后处理',
          id: result.insertId,
          requiresReview: true
        });
      }
      
      // 中低级别敏感词
      return res.json({
        success: true,
        message: '表单提交成功，但检测到可能的敏感内容已被过滤，我们将尽快与您联系',
        id: result.insertId,
        containsSensitiveWords: true
      });
    }
    
    // 正常返回
    res.json({
      success: true,
      message: '表单提交成功，我们将尽快与您联系',
      id: result.insertId
    });
  } catch (error) {
    console.error('提交联系表单失败:', error);
    
    // 记录错误日志
    await logger.error('提交联系表单失败', {
      ip: clientIp,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      message: '提交失败，请稍后重试',
      error: error.message
    });
  }
});

module.exports = router; 