const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// 导入限流中间件
const { apiLimiter, videoResourceLimiter, authLimiter } = require('./middleware/rateLimit');
// 导入敏感词过滤中间件
const { sensitiveWordFilterMiddleware } = require('./middleware/sensitiveWordFilter');
// 导入日志工具
const logger = require('./utils/logger');
// 导入目录检查工具
const ensureDirectories = require('./utils/ensureDirectories');

// 加载环境变量
dotenv.config();

// 确保必要目录存在
ensureDirectories();

const app = express();

// 引入路由
const auth = require('./routes/auth');
const test = require('./routes/test');
const index = require('./routes/index');
const blog = require('./routes/blog');
const resource = require('./routes/resource');
const pricing = require('./routes/pricing');
const contact = require('./routes/contact');

// 中间件
app.use(cors());
app.use(express.json());

// 应用限流中间件到特定路由
app.use('/api/resources/videos', videoResourceLimiter); // 对视频资源应用特殊限流
app.use('/login', authLimiter); // 对登录接口应用更严格的限流
app.use('/register', authLimiter); // 对注册接口应用更严格的限流
app.use('/api', apiLimiter); // 对其他所有API应用通用限流

// 路由
app.use(auth);
app.use(test);
app.use(index);
app.use(blog);
app.use(resource);
app.use(pricing);
app.use(contact);

// 全局错误处理中间件
app.use(async (err, req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // 记录错误日志
  await logger.error('服务器错误', {
    ip: clientIp,
    url: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: err.stack
  });
  
  res.status(500).json({
    success: false,
    message: '服务器内部错误，请稍后重试',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// 404处理
app.use(async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // 记录404日志
  await logger.warning('请求的资源不存在', {
    ip: clientIp,
    url: req.originalUrl,
    method: req.method
  });
  
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  
  // 记录启动日志
  logger.info('服务器启动成功', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  }).catch(err => {
    console.error('记录启动日志失败:', err);
  });
}); 