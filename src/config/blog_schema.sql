-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS test1;

-- 切换到test1数据库
USE test1;

-- 创建blog表
CREATE TABLE IF NOT EXISTS blog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL COMMENT '博客标题',
  description TEXT NOT NULL COMMENT '博客描述内容',
  image VARCHAR(255) COMMENT '博客图片URL',
  tag VARCHAR(50) COMMENT '博客标签',
  date DATE COMMENT '发布日期',
  content TEXT COMMENT '博客完整内容',
  tech_background TEXT COMMENT '技术背景',
  innovation TEXT COMMENT '创新点',
  application TEXT COMMENT '应用场景',
  future TEXT COMMENT '技术展望',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入示例数据
INSERT INTO blog (id, title, description, image, tag, date, tech_background, innovation, application, future) VALUES
(1, '最新突破：深度学习驱动的图像分割技术', '我们的图像分割AI模型基于改进的U-Net架构，结合Transformer注意力机制，使得分割精度提高了23%，尤其在处理复杂边界和小目标时表现突出，为医疗影像和自动驾驶场景提供了更可靠的视觉解析能力。', 'https://via.placeholder.com/600x300/0d4f91/ffffff?text=AI+Image+Segmentation', '技术干货', '2025-04-07', 
'在图像处理领域，图像分割技术一直是计算机视觉的核心挑战。随着深度学习的发展，我们的解决方案利用最新的神经网络架构，实现了更高效、更精准的图像处理效果。', 
'传统的图像处理方法通常依赖于人工设计的特征和规则，而我们的AI模型通过学习大量数据集，能够自动发现图像中的关键特征和模式。这种端到端的学习方式使得处理结果更加自然、准确。',
'医疗影像分析 - 提高病变检测精度\n自动驾驶 - 提升恶劣天气下的视觉清晰度\n安防监控 - 增强低光环境下的图像质量\n数字内容创作 - 提供专业级图像处理工具',
'随着计算能力的提升和算法的优化，我们的AI图像处理技术将持续演进。期待与开发者社区共同探索更多可能性，构建更加强大、灵活的图像处理解决方案。'),

(2, '全新升级：AI图像去雾算法实现全天候清晰视觉', '我们的去雾算法结合大规模预训练视觉模型和物理散射模型，能在极端天气条件下恢复图像细节，去雾效果比传统方法提升40%，已应用于智能监控和户外摄影领域，为用户提供全天候高清晰度的视觉体验。', 'https://via.placeholder.com/600x300/1a69c9/ffffff?text=AI+Defogging', '技术干货', '2025-04-07',
'在图像处理领域，图像去雾技术一直是计算机视觉的核心挑战。随着深度学习的发展，我们的解决方案利用最新的神经网络架构，实现了更高效、更精准的图像处理效果。',
'传统的图像处理方法通常依赖于人工设计的特征和规则，而我们的AI模型通过学习大量数据集，能够自动发现图像中的关键特征和模式。这种端到端的学习方式使得处理结果更加自然、准确。',
'医疗影像分析 - 提高病变检测精度\n自动驾驶 - 提升恶劣天气下的视觉清晰度\n安防监控 - 增强低光环境下的图像质量\n数字内容创作 - 提供专业级图像处理工具',
'随着计算能力的提升和算法的优化，我们的AI图像处理技术将持续演进。期待与开发者社区共同探索更多可能性，构建更加强大、灵活的图像处理解决方案。'),

(3, '深度解读：低光照图像增强技术的突破与应用', '我们的低光照增强技术采用对抗生成网络与双向特征映射，在保留图像细节的同时显著提升亮度和对比度，解决了传统增强方法中的噪点放大问题，特别适用于夜间摄影、安防监控等低光环境下的图像处理需求。', 'https://via.placeholder.com/600x300/3978cc/ffffff?text=AI+Image+Enhancement', '技术干货', '2025-04-07',
'在图像处理领域，图像增强技术一直是计算机视觉的核心挑战。随着深度学习的发展，我们的解决方案利用最新的神经网络架构，实现了更高效、更精准的图像处理效果。',
'传统的图像处理方法通常依赖于人工设计的特征和规则，而我们的AI模型通过学习大量数据集，能够自动发现图像中的关键特征和模式。这种端到端的学习方式使得处理结果更加自然、准确。',
'医疗影像分析 - 提高病变检测精度\n自动驾驶 - 提升恶劣天气下的视觉清晰度\n安防监控 - 增强低光环境下的图像质量\n数字内容创作 - 提供专业级图像处理工具',
'随着计算能力的提升和算法的优化，我们的AI图像处理技术将持续演进。期待与开发者社区共同探索更多可能性，构建更加强大、灵活的图像处理解决方案。'); 