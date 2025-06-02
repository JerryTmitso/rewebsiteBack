-- 切换到test1数据库
USE test1;

-- 创建pricing_contacts表，存储产品定价页面的联系表单数据
CREATE TABLE IF NOT EXISTS pricing_contacts (
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
  
  -- 产品定价相关数据
  selected_type VARCHAR(50) COMMENT '选择的产品类型(性能型/综合型)',
  selected_region VARCHAR(50) COMMENT '选择的地域',
  instance_count INT COMMENT '实例数量',
  storage INT COMMENT '存储容量(GB)',
  billing_type VARCHAR(20) COMMENT '计费类型(按量/包年)',
  estimated_price DECIMAL(10,2) COMMENT '预估价格',
  
  document_path VARCHAR(255) COMMENT '上传文件路径',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 