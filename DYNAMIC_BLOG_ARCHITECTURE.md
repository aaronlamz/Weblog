# 动态博客架构设计

## 当前静态架构分析

### 现状
- 文章存储：`content/blog/*.mdx` 文件
- 数据处理：`gray-matter` 解析 frontmatter
- 渲染：构建时静态生成所有页面
- 部署：静态文件部署到 Vercel

### 局限性
- 需要重新构建才能发布新文章
- 无法动态管理内容
- 不支持用户交互（评论、点赞等）
- 无法实时统计和分析

## 动态博客架构设计

### 1. 数据库设计

#### 选择建议
- **PostgreSQL**: 推荐，功能强大，支持全文搜索
- **MySQL**: 传统选择，生态成熟
- **MongoDB**: 适合文档型数据，灵活性高

#### 数据库表结构

```sql
-- 用户表
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 文章表
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  author_id INTEGER REFERENCES users(id),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- 标签表
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 文章标签关联表
CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 评论表
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 文章统计表
CREATE TABLE post_analytics (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  reading_time INTEGER,
  UNIQUE(post_id, date)
);
```

### 2. 后端架构

#### Option 1: Next.js API Routes (推荐)

```typescript
// src/lib/db.ts - 数据库连接
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export { pool }

// src/lib/models/post.ts - 文章模型
export interface Post {
  id: number
  slug: string
  title: string
  description: string
  content: string
  published: boolean
  featured: boolean
  authorId: number
  viewCount: number
  likeCount: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
}

export class PostModel {
  static async findAll(options?: {
    published?: boolean
    limit?: number
    offset?: number
    tag?: string
  }): Promise<Post[]> {
    // 实现查询逻辑
  }

  static async findBySlug(slug: string): Promise<Post | null> {
    // 实现查询逻辑
  }

  static async create(data: Partial<Post>): Promise<Post> {
    // 实现创建逻辑
  }

  static async update(id: number, data: Partial<Post>): Promise<Post> {
    // 实现更新逻辑
  }

  static async delete(id: number): Promise<void> {
    // 实现删除逻辑
  }
}
```

#### API 路由设计

```typescript
// src/app/api/posts/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const tag = searchParams.get('tag')
  
  const posts = await PostModel.findAll({
    published: true,
    limit,
    offset: (page - 1) * limit,
    tag
  })
  
  return Response.json({ posts })
}

export async function POST(request: Request) {
  // 创建文章逻辑
}

// src/app/api/posts/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const post = await PostModel.findBySlug(params.slug)
  if (!post) {
    return new Response('Not found', { status: 404 })
  }
  
  // 增加浏览量
  await PostModel.incrementViews(post.id)
  
  return Response.json({ post })
}
```

### 3. 前端架构改造

#### 页面组件改造

```typescript
// src/app/blog/page.tsx - 动态博客列表
'use client'
import { useEffect, useState } from 'react'
import { Post } from '@/lib/types'

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchPosts()
  }, [page])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=10`)
      const { posts } = await response.json()
      setPosts(posts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 渲染文章列表 */}
    </div>
  )
}

// src/app/blog/[slug]/page.tsx - 动态文章详情
export default async function PostPage({ params }: { params: { slug: string } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.slug}`)
  
  if (!response.ok) {
    notFound()
  }
  
  const { post } = await response.json()
  
  return (
    <article>
      {/* 渲染文章内容 */}
    </article>
  )
}
```

### 4. 内容管理系统 (CMS)

#### Option 1: 自建管理后台

```typescript
// src/app/admin/posts/page.tsx
'use client'
export default function AdminPostsPage() {
  return (
    <div className="admin-layout">
      <h1>文章管理</h1>
      {/* 文章列表、编辑、删除功能 */}
    </div>
  )
}

// src/app/admin/posts/new/page.tsx
export default function NewPostPage() {
  return (
    <div className="admin-layout">
      <h1>创建新文章</h1>
      {/* 富文本编辑器，支持 Markdown */}
    </div>
  )
}
```

#### Option 2: 集成第三方 CMS
- **Strapi**: 开源无头 CMS
- **Sanity**: 结构化内容平台
- **Contentful**: 商业 CMS 解决方案

### 5. 文章编写方式

#### 方式一：Web 编辑器
```typescript
// 集成富文本编辑器
import MDEditor from '@uiw/react-md-editor'

export default function PostEditor() {
  const [content, setContent] = useState('')
  
  return (
    <MDEditor
      value={content}
      onChange={(val) => setContent(val || '')}
      preview="edit"
    />
  )
}
```

#### 方式二：API 接口
```typescript
// 通过 API 批量导入现有 MDX 文件
export async function migrateFromMDX() {
  const posts = getAllPosts() // 现有的静态文章
  
  for (const post of posts) {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...post,
        content: post.content,
        published: true
      })
    })
  }
}
```

#### 方式三：Git + Webhook
```typescript
// 监听 Git 仓库变化，自动同步文章
export async function syncFromGit() {
  // 1. 监听 GitHub Webhook
  // 2. 解析新增/修改的 MDX 文件
  // 3. 自动创建/更新数据库记录
}
```

### 6. 缓存策略

```typescript
// src/lib/cache.ts
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export class CacheService {
  static async getPost(slug: string): Promise<Post | null> {
    const cached = await redis.get(`post:${slug}`)
    if (cached) return JSON.parse(cached)
    
    const post = await PostModel.findBySlug(slug)
    if (post) {
      await redis.setex(`post:${slug}`, 3600, JSON.stringify(post))
    }
    return post
  }

  static async invalidatePost(slug: string) {
    await redis.del(`post:${slug}`)
  }
}
```

### 7. 部署架构

#### 选择一：Vercel + 数据库
```yaml
# vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "env": {
    "DATABASE_URL": "@database_url",
    "REDIS_URL": "@redis_url"
  }
}
```

#### 选择二：Docker + 云服务器
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 8. 迁移步骤

1. **数据库搭建**
   ```bash
   # 创建数据库
   createdb weblog_dynamic
   
   # 运行迁移脚本
   npm run db:migrate
   ```

2. **数据迁移**
   ```typescript
   // 将现有 MDX 文章导入数据库
   npm run migrate:posts
   ```

3. **逐步替换**
   - 保留静态页面作为备份
   - 新文章使用动态方式
   - 逐步迁移老文章

4. **测试和优化**
   - 性能测试
   - SEO 优化
   - 缓存调优

## 总结

这个架构提供了：
- ✅ 实时内容管理
- ✅ 用户交互功能
- ✅ 灵活的内容编辑
- ✅ 数据统计分析
- ✅ 良好的扩展性
- ✅ SEO 友好

你可以根据实际需求选择合适的技术栈和实现方式。建议先从简单的 API + 数据库开始，逐步添加更多功能。