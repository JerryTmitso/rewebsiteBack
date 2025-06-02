/**
 * 日志工具
 * 用于记录系统事件、错误和安全警告
 */

const fs = require('fs').promises;
const path = require('path');

// 日志目录
const logDir = path.join(__dirname, '../../logs');

// 确保日志目录存在
async function ensureLogDir() {
  try {
    await fs.access(logDir);
  } catch (error) {
    await fs.mkdir(logDir, { recursive: true });
  }
}

// 日志级别
const LogLevel = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SECURITY: 'SECURITY'
};

/**
 * 写入日志
 * @param {string} level 日志级别
 * @param {string} message 日志消息
 * @param {Object} data 附加数据
 */
async function writeLog(level, message, data = {}) {
  await ensureLogDir();
  
  const now = new Date();
  const logDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timestamp = now.toISOString();
  
  const logEntry = {
    timestamp,
    level,
    message,
    data
  };
  
  const logFileName = `${logDate}.log`;
  const logFilePath = path.join(logDir, logFileName);
  
  try {
    const logString = JSON.stringify(logEntry) + '\n';
    await fs.appendFile(logFilePath, logString);
  } catch (error) {
    console.error('写入日志失败:', error);
  }
}

/**
 * 记录信息日志
 */
async function info(message, data = {}) {
  await writeLog(LogLevel.INFO, message, data);
}

/**
 * 记录警告日志
 */
async function warning(message, data = {}) {
  await writeLog(LogLevel.WARNING, message, data);
}

/**
 * 记录错误日志
 */
async function error(message, data = {}) {
  await writeLog(LogLevel.ERROR, message, data);
}

/**
 * 记录安全日志
 */
async function security(message, data = {}) {
  await writeLog(LogLevel.SECURITY, message, data);
}

module.exports = {
  LogLevel,
  info,
  warning,
  error,
  security
}; 