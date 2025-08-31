# 部署配置说明

本项目支持双重部署模式，可以同时部署到两个不同的 GitHub Pages 环境。

## 部署目标

1. **子路径部署**: https://www.ultimate-kernel.fun/Weblog/
   - 仓库: `aaronlamz/Weblog`
   - 分支: `gh-pages`
   - BASE_PATH: `/Weblog`

2. **根路径部署**: https://www.ultimate-kernel.fun/
   - 仓库: `aaronlamz/aaronlamz.github.io`
   - 分支: `master`
   - BASE_PATH: 空

## GitHub Actions 配置

### 当前使用的工作流
- `.github/workflows/dual-deploy.yml` - 双重部署配置

### 备份的工作流
- `.github/workflows/deploy-old.yml.backup` - 原始的单一部署配置（已停用）

## 环境变量

### 子路径构建
```bash
BASE_PATH=/Weblog
NEXT_PUBLIC_SITE_URL=https://aaronlamz.github.io
```

### 根路径构建
```bash
BASE_PATH=""
NEXT_PUBLIC_SITE_URL=https://www.ultimate-kernel.fun
```

## 所需的 GitHub Secrets

在 `aaronlamz/Weblog` 仓库的 Settings -> Secrets and variables -> Actions 中配置：

1. **GITHUB_TOKEN** (自动提供)
   - 用于部署到当前仓库的 gh-pages 分支

2. **PERSONAL_ACCESS_TOKEN** (需要手动创建)
   - 用于部署到外部仓库 `aaronlamz/aaronlamz.github.io`
   - 创建方法: GitHub Settings -> Developer settings -> Personal access tokens -> Tokens (classic)
   - 权限: `repo` (Full control of private repositories)

## 部署流程

1. 推送代码到 `main` 分支
2. GitHub Actions 自动触发 `dual-deploy.yml`
3. 构建两个版本:
   - 带 BASE_PATH 的子路径版本
   - 不带 BASE_PATH 的根路径版本
4. 同时部署到两个目标仓库
5. 两个网址都可以正常访问

## 手动触发部署

可以在 GitHub Actions 页面手动触发 "Dual Deploy (Sub-path + Root)" 工作流。

## 故障排除

### 部署失败
1. 检查 PERSONAL_ACCESS_TOKEN 是否正确配置
2. 确认 token 有 `repo` 权限
3. 检查目标仓库 `aaronlamz/aaronlamz.github.io` 是否存在

### 路径问题
- 子路径版本的资源链接包含 `/Weblog` 前缀
- 根路径版本的资源链接没有前缀
- 这是通过 `BASE_PATH` 环境变量控制的

### 国际化
- 默认语言（中文）的内容会被复制到根路径，实现无前缀访问
- 其他语言保持 `/en/` 等前缀

## 注意事项

1. **不要删除** `.nojekyll` 文件，它确保 GitHub Pages 正确处理 `_next` 等下划线目录
2. 每次部署都会覆盖目标分支的内容（`force_orphan: true`）
3. 两个部署是独立的，一个失败不影响另一个