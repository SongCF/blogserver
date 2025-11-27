# haowanai.cn 个人博客网站

## 项目简介

这是一个简洁优雅的个人博客分享网站，采用黑白灰配色方案，体现极简主义设计理念。网站已按照设计规范完全实现，支持文章分类、响应式布局和动态内容加载。

## 网站特性

### 🎨 设计特色
- **极简风格**：采用黑白灰配色，营造干净简洁的视觉体验
- **响应式设计**：完美适配桌面端和移动端设备，自适应各种屏幕尺寸
- **现代排版**：使用Inter字体，确保优秀的可读性
- **瑞士设计理念**：基于严格网格系统，体现秩序与美观

### 📱 功能特点
- **文章分类系统**：支持读书类、编程类、随笔类文章分类浏览
- **动态文章加载**：基于目录结构自动读取和展示文章
- **导航栏功能**：
  - 小游戏体验 → https://h5wan.haowanai.cn
  - 工具体验 → https://tools.haowanai.cn
  - 联系我 → 弹出邮箱联系方式
- **交互体验**：
  - 联系我模态框
  - 移动端响应式菜单
  - 平滑滚动效果
  - 返回顶部功能
  - 加载动画
  - 文章分类筛选

## 文件结构

```
haowanai-blog/
├── index.html                    # 主页面文件
├── styles/
│   ├── main.css                  # 主样式文件（黑白灰设计）
│   └── article.css               # 文章详情页样式
├── scripts/
│   ├── main.js                   # 主页面JavaScript功能
│   └── article.js                # 文章详情页JavaScript功能
├── articles/                     # 文章目录
│   ├── programming/              # 编程类文章
│   │   └── solid-principles.html
│   ├── reading/                  # 读书类文章
│   │   └── sapiens-thoughts.html
│   └── essay/                    # 随笔类文章
│       └── night-codes.html
└── imgs/
    ├── blog_header_1.jpg         # 博客头部背景图
    ├── blog_icon_2.jpg           # 博客图标
    └── ...                       # 其他图片素材
```

## 新增功能详解

### 📂 文章分类系统
- **编程类**：技术文章、开发心得、代码设计等
- **读书类**：读书笔记、书评、阅读感悟等  
- **随笔类**：生活感悟、技术随想、个人思考等

### 🔄 动态内容加载
- 自动读取 `articles/` 目录下的文章文件
- 根据分类筛选显示对应文章
- 支持添加新文章只需在对应分类目录创建HTML文件

### 📱 移动端优化
- 完全响应式设计，适配各种屏幕尺寸
- 移动端专用汉堡菜单
- 触摸友好的交互设计
- 优化的移动端阅读体验

## 部署说明

### 1. 域名配置
网站部署到 `https://haowanai.cn` 域名

### 2. 部署步骤
1. 将所有文件上传到服务器
2. 确保服务器配置正确处理静态文件
3. 配置域名解析到服务器IP
4. 设置SSL证书（HTTPS）

### 3. 服务器要求
- 支持静态文件托管
- 支持HTTPS协议
- 建议使用Nginx或Apache

## 添加新文章

### 1. 创建文章文件
在对应分类目录下创建新的HTML文件：
- 编程类：`articles/programming/`
- 读书类：`articles/reading/`
- 随笔类：`articles/essay/`

### 2. 文章文件模板
复制现有文章文件作为模板，或创建新文件：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>您的文章标题 - haowanai.cn</title>
    <!-- 其他meta标签和样式引用 -->
</head>
<body>
    <!-- 导航栏（与主页保持一致） -->
    <nav class="navbar">
        <!-- 导航内容 -->
    </nav>

    <!-- 文章内容 -->
    <article class="article-content">
        <div class="article-header">
            <div class="article-meta">
                <span class="category category-分类名">分类名</span>
                <time class="publish-date">发表日期</time>
            </div>
            <h1 class="article-title">您的文章标题</h1>
            <div class="article-summary">文章摘要</div>
        </div>
        
        <div class="article-body">
            <!-- 文章正文内容 -->
        </div>
    </article>

    <!-- 其他组件（模态框、菜单等） -->
    <script src="../scripts/article.js"></script>
</body>
</html>
```

### 3. 手动注册文章
如果自动加载不工作，可在 `scripts/main.js` 中手动添加文章信息：

```javascript
const articlesData = {
    programming: [
        // 添加新文章
        {
            title: "新文章标题",
            date: "2025年X月X日",
            file: "articles/programming/new-article.html",
            summary: "文章摘要"
        }
        // ... 其他文章
    ],
    // 其他分类
};
```

## 技术规格

### 响应式断点
- **桌面端**：≥ 768px
- **移动端**：< 768px
- **超小屏幕**：< 480px

### 字体系统
- **主字体**：Inter (Google Fonts)
- **字体权重**：400, 500, 600, 700

### 配色方案
- **主背景**：#FFFFFF (纯白)
- **主文本**：#141414 (深黑)
- **次要文本**：#495057 (中性灰)
- **边框**：#DEE2E6 (浅灰)

### 交互效果
- **悬停动画**：200ms线性过渡
- **模态框**：250ms缩放动画
- **菜单切换**：流畅的展开/收起
- **加载动画**：旋转加载指示器

## 浏览器兼容性

- ✅ Chrome (最新版本)
- ✅ Firefox (最新版本)
- ✅ Safari (最新版本)
- ✅ Edge (最新版本)
- ✅ 移动端浏览器

## 性能优化

- **图片优化**：使用适当的图片格式和大小
- **代码压缩**：CSS和JavaScript代码已优化
- **字体加载**：使用预连接提升字体加载速度
- **响应式图片**：根据设备分辨率加载合适尺寸
- **懒加载**：按需加载文章内容
- **缓存策略**：合理的缓存头设置

## 自定义修改

### 修改网站配色
在 `styles/main.css` 中修改颜色变量：

```css
:root {
    --primary-color: #141414;
    --secondary-color: #495057;
    --border-color: #DEE2E6;
}
```

### 添加新分类
1. 在 `scripts/main.js` 中添加新的分类配置
2. 在 `index.html` 中添加新的筛选标签
3. 创建对应分类目录

### 修改导航链接
在导航栏部分修改目标链接：

```html
<a href="https://your-link.com" target="_blank" class="nav-link">您的链接</a>
```

## 联系信息

- **邮箱**：821416394@qq.com
- **网站**：https://haowanai.cn
- **小游戏**：https://h5wan.haowanai.cn
- **工具**：https://tools.haowanai.cn

---

*设计理念：简约而不简单，功能与美学的完美结合。*

*更新时间：2025年11月27日*