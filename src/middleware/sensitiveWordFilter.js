/**
 * 敏感词过滤中间件
 * 用于过滤用户提交内容中的敏感词，防止不良信息传播
 */

const logger = require('../utils/logger');

// 敏感词列表 - 实际应用中应该从数据库或配置文件加载
const sensitiveWords = [
  '政治敏感词', '色情', '赌博', '诈骗', '暴力', '恐怖', 
  '传销', '非法集资', '违禁药品', '枪支', '军火',
  '黄赌毒', '法轮功', '反动', '邪教'
];

// 敏感词级别定义
const SensitivityLevel = {
  LOW: 'low',       // 低敏感度，普通敏感词
  MEDIUM: 'medium', // 中敏感度，需要特别关注
  HIGH: 'high'      // 高敏感度，可能涉及违法内容
};

// 敏感词与级别映射
const wordLevelMap = {
  '政治敏感词': SensitivityLevel.MEDIUM,
  '色情': SensitivityLevel.MEDIUM,
  '赌博': SensitivityLevel.MEDIUM,
  '诈骗': SensitivityLevel.MEDIUM,
  '暴力': SensitivityLevel.MEDIUM,
  '恐怖': SensitivityLevel.HIGH,
  '传销': SensitivityLevel.MEDIUM,
  '非法集资': SensitivityLevel.HIGH,
  '违禁药品': SensitivityLevel.HIGH,
  '枪支': SensitivityLevel.HIGH,
  '军火': SensitivityLevel.HIGH,
  '黄赌毒': SensitivityLevel.HIGH,
  '法轮功': SensitivityLevel.HIGH,
  '反动': SensitivityLevel.HIGH,
  '邪教': SensitivityLevel.HIGH
};

/**
 * 检查并过滤文本中的敏感词
 * @param {string} text 需要检查的文本
 * @returns {{filtered: string, hasSensitiveWord: boolean, detectedWords: Array, highestLevel: string}} 处理结果
 */
function filterText(text) {
  if (!text || typeof text !== 'string') {
    return { 
      filtered: text, 
      hasSensitiveWord: false,
      detectedWords: [],
      highestLevel: null
    };
  }

  let hasSensitiveWord = false;
  let filteredText = text;
  const detectedWords = [];
  let highestLevel = null;

  sensitiveWords.forEach(word => {
    if (text.includes(word)) {
      hasSensitiveWord = true;
      detectedWords.push(word);
      
      // 更新最高敏感级别
      const wordLevel = wordLevelMap[word] || SensitivityLevel.LOW;
      if (!highestLevel || 
          (wordLevel === SensitivityLevel.HIGH) || 
          (wordLevel === SensitivityLevel.MEDIUM && highestLevel === SensitivityLevel.LOW)) {
        highestLevel = wordLevel;
      }
      
      // 将敏感词替换为等长度的星号
      const stars = '*'.repeat(word.length);
      filteredText = filteredText.replace(new RegExp(word, 'g'), stars);
    }
  });

  return { 
    filtered: filteredText, 
    hasSensitiveWord, 
    detectedWords,
    highestLevel: highestLevel || SensitivityLevel.LOW
  };
}

/**
 * 敏感词过滤中间件函数
 * 检查请求体中的指定字段是否包含敏感词
 */
function sensitiveWordFilterMiddleware(fieldsToCheck = []) {
  return async (req, res, next) => {
    if (!req.body) {
      return next();
    }

    let hasSensitiveContent = false;
    const allDetectedWords = [];
    let highestDetectedLevel = null;
    const filteredFields = {};

    // 检查指定的字段
    for (const field of fieldsToCheck) {
      if (req.body[field]) {
        const { filtered, hasSensitiveWord, detectedWords, highestLevel } = filterText(req.body[field]);
        
        if (hasSensitiveWord) {
          req.body[field] = filtered;
          hasSensitiveContent = true;
          allDetectedWords.push(...detectedWords);
          filteredFields[field] = true;
          
          // 更新最高敏感级别
          if (!highestDetectedLevel || 
              (highestLevel === SensitivityLevel.HIGH) || 
              (highestLevel === SensitivityLevel.MEDIUM && highestDetectedLevel === SensitivityLevel.LOW)) {
            highestDetectedLevel = highestLevel;
          }
        }
      }
    }

    // 如果包含敏感内容，在请求对象上添加标记
    if (hasSensitiveContent) {
      req.containsSensitiveWords = true;
      req.sensitiveWordsInfo = {
        detectedWords: [...new Set(allDetectedWords)], // 去重
        highestLevel: highestDetectedLevel,
        filteredFields
      };
      
      // 记录敏感词日志
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      try {
        await logger.security('检测到敏感词', {
          ip: clientIp,
          endpoint: req.originalUrl,
          detectedWords: [...new Set(allDetectedWords)],
          highestLevel: highestDetectedLevel,
          filteredFields
        });
      } catch (error) {
        console.error('记录敏感词日志失败:', error);
      }
    }

    next();
  };
}

module.exports = {
  sensitiveWordFilterMiddleware,
  filterText,
  SensitivityLevel
}; 