-- 切换到test1数据库
USE test1;

-- 创建resources表
CREATE TABLE IF NOT EXISTS resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('video', 'whitepaper', 'report') NOT NULL COMMENT '资源类型：视频/白皮书/分析报告',
  title VARCHAR(255) NOT NULL COMMENT '资源标题',
  description TEXT NOT NULL COMMENT '资源描述内容',
  thumbnail VARCHAR(255) COMMENT '资源缩略图URL',
  file_url VARCHAR(255) COMMENT '资源文件URL（视频或PDF）',
  duration VARCHAR(10) COMMENT '视频时长（仅适用于视频类型）',
  file_size VARCHAR(10) COMMENT '文件大小（仅适用于下载类型）',
  date DATE COMMENT '发布日期',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入示例数据
INSERT INTO resources (id, type, title, description, thumbnail, file_url, duration, file_size, date) VALUES
(1, 'video', '图像分割技术详解', '深度学习在图像分割领域的应用，从基础理论到实践案例的全面讲解', 'https://via.placeholder.com/600x300/0d4f91/ffffff?text=图像分割教程', '/videos/segment_tutorial.mp4', '28:45', NULL, '2025-05-12'),
(2, 'video', '一步到位，详解图像去雾算法', '如何利用人工智能技术去除图像中的雾霾效果，提升图像清晰度', 'https://via.placeholder.com/600x300/1a69c9/ffffff?text=图像去雾教程', '/videos/defog_tutorial.mp4', '22:15', NULL, '2025-04-28'),
(3, 'video', '玩转AI图像增强技术', '低光照图像增强技术解析，如何使暗光环境下的图片焕然一新', 'https://via.placeholder.com/600x300/3978cc/ffffff?text=图像增强教程', '/videos/enhance_tutorial.mp4', '35:10', NULL, '2025-04-15'),
(4, 'whitepaper', 'AI图像处理白皮书', '全面解析人工智能图像处理行业现状与未来发展趋势', 'https://via.placeholder.com/600x300/2563eb/ffffff?text=AI白皮书', '/files/ai_whitepaper.pdf', NULL, '4.2MB', '2025-03-20'),
(5, 'report', '图像处理市场分析报告', '2025年全球AI图像处理市场的深度分析与未来预测', 'https://via.placeholder.com/600x300/4b72d9/ffffff?text=市场分析', '/files/market_report.pdf', NULL, '3.8MB', '2025-02-15'),
(6, 'video', '医疗图像处理实战演示', '如何将AI图像处理技术应用于医疗影像分析，提高诊断准确率', 'https://via.placeholder.com/600x300/5e87e8/ffffff?text=医疗图像处理', '/videos/medical_demo.mp4', '41:22', NULL, '2025-01-30'); 