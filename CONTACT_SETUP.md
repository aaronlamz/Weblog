# 联系表单配置说明

## 🎯 当前状态

联系表单已经改进，提供两种工作模式：

### 1. **改进的 mailto 方案** (当前使用)
- ✅ **已生效** - 无需额外配置
- ✅ **用户体验改进** - 格式化的邮件内容
- ✅ **状态反馈** - 显示操作结果
- 📱 **工作方式**: 生成格式友好的 mailto 链接

### 2. **EmailJS 方案** (可选升级)
- 🔧 **需要配置** - 设置 EmailJS 服务
- ✨ **最佳体验** - 直接在页面发送邮件
- 📈 **企业级** - 可靠的邮件发送

## 🚀 EmailJS 配置 (可选)

如果你想要最佳的用户体验，可以配置 EmailJS：

### 步骤 1: 注册 EmailJS
1. 访问 [EmailJS](https://www.emailjs.com/) 并注册账号
2. 创建新的邮件服务
3. 选择你的邮件提供商 (Gmail, Outlook 等)

### 步骤 2: 创建邮件模板
创建模板，包含以下变量：
- `{{from_name}}` - 发送者姓名
- `{{from_email}}` - 发送者邮箱  
- `{{subject}}` - 邮件主题
- `{{message}}` - 邮件内容

### 步骤 3: 获取配置信息
- Service ID: 在服务列表中查看
- Template ID: 在模板列表中查看  
- Public Key: 在 Account > API Keys 中查看

### 步骤 4: 添加环境变量
创建 `.env.local` 文件：
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## 📝 使用效果对比

### 改进 mailto (当前)
```
名称: 张三
邮箱: zhangsan@example.com

消息:
你好，我对你的项目很感兴趣...
```

### EmailJS (配置后)
- 直接在页面发送
- 无需跳转邮件客户端
- 即时状态反馈
- 自动表单重置

## 🔧 测试方法

1. 访问 `/contact` 页面
2. 填写表单
3. 点击 "Send Message"
4. 查看反馈消息

**当前行为**: 将打开优化的 mailto 链接
**配置 EmailJS 后**: 直接发送邮件