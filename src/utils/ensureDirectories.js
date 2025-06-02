/**
 * 确保应用程序所需的目录结构存在
 */

const fs = require('fs');
const path = require('path');

// 需要确保存在的目录
const requiredDirs = [
  path.join(__dirname, '../../logs'),
  path.join(__dirname, '../../uploads'),
  path.join(__dirname, '../../data')
];

/**
 * 确保所有必要的目录存在
 */
function ensureDirectories() {
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`创建目录: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  console.log('目录检查完成，所有必要的目录都已存在');
}

// 导出函数以便在应用启动时使用
module.exports = ensureDirectories; 