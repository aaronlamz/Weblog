# TechStack 组件可维护扩展指南

## 当前架构
TechStack 组件目前使用硬编码的技术栈数据，分为两行显示：
- `techRow1`: 左到右滚动
- `techRow2`: 右到左滚动

## 推荐的可维护扩展方案

### 方案1: 直接修改（最简单）
直接在 `src/components/tech-stack.tsx` 的 `techRow1` 或 `techRow2` 数组中添加新技术：

```typescript
// 在现有数组末尾添加
{
  name: 'Rust',
  icon: `<svg viewBox="0 0 24 24" fill="currentColor">...</svg>`,
  color: '#CE422B'
}
```

### 方案2: 配置文件分离（推荐）
1. 将技术栈数据移至 `src/config/tech-stack.ts`
2. 在组件中导入使用：
   ```typescript
   import { techRow1, techRow2 } from '@/config/tech-stack'
   ```

### 方案3: 动态配置（长期）
创建可配置的技术栈管理：

```typescript
// src/lib/tech-stack-manager.ts
export class TechStackManager {
  static addTech(tech: TechItem, rowIndex: 1 | 2) {
    // 动态添加逻辑
  }
  
  static removeTech(name: string, rowIndex: 1 | 2) {
    // 动态删除逻辑
  }
}
```

## 新增技术的步骤

1. **获取图标**: 从 [Simple Icons](https://simpleicons.org/) 获取官方 SVG
2. **确定颜色**: 使用品牌官方颜色
3. **选择行**: 
   - 第一行（左到右滚动）：前端技术优先
   - 第二行（右到左滚动）：后端/工具技术优先
4. **添加数据**:
   ```typescript
   {
     name: '技术名称',
     icon: `<svg>...</svg>`, // SVG 代码
     color: '#颜色值' // 可选，不提供使用默认色
   }
   ```

## 注意事项
- SVG 图标需要包含 `viewBox="0 0 24 24" fill="currentColor"`
- 颜色使用十六进制格式（如 `#F7DF1E`）
- 技术名称与官方保持一致
- 新增后测试滚动效果和显示效果

## 示例：添加 Rust
```typescript
{
  name: 'Rust',
  icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.8346..."/></svg>`,
  color: '#CE422B'
}
```

这样的设计既保持了代码的简洁性，又为未来的扩展提供了良好的基础。