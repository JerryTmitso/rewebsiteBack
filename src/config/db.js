const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'test_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接函数
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
    return { success: true, message: '数据库连接成功' };
  } catch (error) {
    console.error('数据库连接失败:', error);
    return { success: false, message: '数据库连接失败', error: error.message };
  }
}

module.exports = {
  pool,
  testConnection
}; 