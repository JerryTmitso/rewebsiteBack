const rateLimit = require('express-rate-limit');

// 通用API限流中间件 - 适用于大多数API端点
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟时间窗口
  max: 100, // 每个IP在时间窗口内最多100个请求
  standardHeaders: true, // 返回标准的RateLimit头信息
  legacyHeaders: false, // 禁用旧的X-RateLimit头信息
  message: {
    status: 429,
    success: false,
    message: '请求过于频繁，请稍后再试'
  }
});

// 视频资源限流中间件 - 针对视频资源的特殊限流
const videoResourceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时时间窗口
  max: 30, // 每个IP在时间窗口内最多30个请求
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    message: '视频资源请求过于频繁，请稍后再试'
  }
});

// 身份认证接口限流中间件 - 防止暴力破解
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时时间窗口
  max: 10, // 每个IP在时间窗口内最多10个登录请求
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    message: '登录尝试次数过多，请1小时后再试'
  }
});

module.exports = {
  apiLimiter,
  videoResourceLimiter,
  authLimiter
}; 