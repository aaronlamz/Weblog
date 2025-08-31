# GitHub Secrets 配置指南

为了让双重部署正常工作，你需要在 GitHub 中配置一个 Personal Access Token。

## 步骤 1: 创建 Personal Access Token

1. 登录 GitHub，访问: https://github.com/settings/tokens
2. 点击 "Generate new token" -> "Generate new token (classic)"
3. 填写以下信息:
   - **Note**: `Weblog Dual Deploy Token`
   - **Expiration**: 建议选择 "No expiration" 或更长期限
   - **Select scopes**: 勾选 `repo` (Full control of private repositories)
4. 点击 "Generate token"
5. **重要**: 复制生成的 token（只显示一次）

## 步骤 2: 在仓库中添加 Secret

1. 访问 Weblog 仓库: https://github.com/aaronlamz/Weblog
2. 点击 "Settings" 标签
3. 在左侧菜单中选择 "Secrets and variables" -> "Actions"
4. 点击 "New repository secret"
5. 填写:
   - **Name**: `PERSONAL_ACCESS_TOKEN`
   - **Secret**: 粘贴刚才复制的 token
6. 点击 "Add secret"

## 步骤 3: 验证配置

配置完成后，你可以:

1. 推送代码到 `main` 分支，GitHub Actions 会自动运行
2. 或者在 Actions 页面手动触发 "Dual Deploy" 工作流

## 预期结果

成功配置后，每次推送都会自动部署到两个地址:

- 🔗 子路径版本: https://www.ultimate-kernel.fun/Weblog/
- 🔗 根路径版本: https://www.ultimate-kernel.fun/

## 故障排除

### Token 权限错误
如果看到权限错误，确保 token 有 `repo` 权限。

### 目标仓库不存在
确认 `aaronlamz/aaronlamz.github.io` 仓库已创建。

### Actions 失败
检查 Actions 页面的详细日志，通常会显示具体的错误原因。