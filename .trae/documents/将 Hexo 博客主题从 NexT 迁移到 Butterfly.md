## 迁移计划

### 1. 安装 Butterfly 主题
- 使用 npm 安装 `hexo-theme-butterfly`
- 创建主题配置文件 `_config.butterfly.yml`

### 2. 配置 Butterfly 主题
将 NexT 主题的配置迁移到 Butterfly，保持所有功能不变：

**基础配置：**
- 站点信息（标题、副标题、作者、头像）
- Favicon 图标

**菜单配置（保持原有结构）：**
```yaml
menu:
  首页: / || fas fa-home
  全部文章: /archives || fas fa-th-list
  面试经验: /interview || fas fa-briefcase
  Golang: /golang || fab fa-golang
  MySQL: /mysql || fas fa-database
  Redis: /redis || fas fa-fire
  计算机网络: /network || fas fa-globe
  Leetcode题解: /algorithms || fas fa-book
  关于我: /about || fas fa-user
```

**功能迁移：**
- 本地搜索 → Butterfly local_search
- Gitalk 评论 → Butterfly Gitalk 配置
- MathJax 数学公式 → Butterfly mathjax
- Mermaid 图表 → Butterfly mermaid
- 不蒜子统计 → Butterfly busuanzi
- 暗黑模式 → Butterfly darkmode
- 阅读进度条 → Butterfly reading_progress
- TOC 目录 → Butterfly toc
- 代码高亮/复制 → Butterfly highlight/copy

**社交链接：**
- GitHub: https://github.com/AdrianWangs
- E-Mail: wyz17601402786@gmail.com

### 3. 更新 Hexo 主配置
修改 `_config.yml` 中的 `theme: next` 为 `theme: butterfly`

### 4. 页面兼容性处理
- categories 和 tags 页面的 front-matter 保持不变（Butterfly 兼容）
- 其他自定义页面无需修改

### 5. 插件兼容性检查
- hexo-stats-echarts 插件的自定义标签（heatmapchart、piechart、radarchart）需要验证兼容性
- hexo-butterfly-git-gitcalendar 是专为 Butterfly 设计的，继续使用

### 6. 测试验证
- 停止当前运行的服务
- 清理缓存 `hexo clean`
- 重新生成 `hexo generate`
- 启动服务 `hexo server` 验证效果

---

**预期效果：** 
- 博客外观风格变为 Butterfly 主题风格
- 所有菜单、分类、标签、搜索等功能保持不变
- 所有文章内容完全不变