---
description: 通用博客文章模板，适用于创建一般性博客文章
globs: 
alwaysApply: false
---
# Generic Article Template

## Article Structure for Generic Blog Content

When creating a new general blog article:

1. Create a new Markdown file manually in the `source/_posts/` directory:
```bash
# File should be named in this format:
YYYY-MM-DD-Article-Title.md
```

2. Add the front matter to include appropriate metadata:
```yaml
---
title: "Article Title"
date: YYYY-MM-DD HH:MM:SS  # Always use time-mcp tools to get current time
categories:
  - Primary Category
  - Secondary Category (optional)
tags:
  - Tag1
  - Tag2
  - Tag3
description: "A brief description of the article (150-200 characters)"
thumbnail: "/images/path-to-thumbnail.jpg" # Optional
---
```

> **Important**: 
> 1. Always use the time-mcp tools to get the current date and time for the `date` field. Refer to the [Time Tools Usage](mdc:hexo-blog/.cursor/rules/blog/time-tools-usage.mdc) rule for details.
> 2. If your article includes mathematical formulas, follow the [Math Formulas Guide](mdc:hexo-blog/.cursor/rules/content/math-formula-guide.mdc) for proper formatting.

3. Structure your post with these sections:

   ### Introduction
   - Start with an engaging hook
   - Provide context for the topic
   - Briefly outline what the article will cover
   - Consider adding a relevant image or quote

   ### Main Content
   - Break content into logical sections with clear headings
   - Use subheadings (H3, H4) to organize related points
   - Include images, code snippets, or diagrams where helpful
   - Use bullet points or numbered lists for easy reading
   - Include real-world examples or case studies
   - For mathematical concepts, use proper formula formatting:
     ```markdown
     内联公式示例: $y = mx + b$ 表示一条直线
     
     块级公式示例:
     $$
     E = mc^2
     $$
     ```

   ### Conclusion
   - Summarize key points
   - Provide actionable takeaways
   - Consider questions for readers to reflect on
   - Suggest related topics for further reading

   ### References (Optional)
   - List any sources cited
   - Include recommended resources
   - Link to related articles on your blog

4. Enhancement tips:
   - Use consistent formatting throughout
   - Break up large text blocks for readability
   - Include at least one relevant image
   - Use bold and italics for emphasis, but sparingly
   - Preview the article to check formatting before publishing
   - For mathematical content, ensure formulas are properly rendered using the guidelines in the [Math Formulas Guide](mdc:hexo-blog/.cursor/rules/content/math-formula-guide.mdc)

## Example Template Structure

```markdown
---
title: "How to Master Markdown for Technical Writing"
date: 2023-01-15 14:30:00
categories:
  - Writing
  - Technical Skills
tags:
  - Markdown
  - Documentation
  - Writing Tips
description: "A comprehensive guide to using Markdown effectively for technical documentation, with examples and best practices for developers and technical writers."
thumbnail: "/images/markdown-guide.jpg"
---

## Introduction

Markdown has revolutionized technical documentation by providing a simple yet powerful way to format text. This guide will walk you through mastering Markdown for your technical writing needs.

## What is Markdown?

Markdown is a lightweight markup language created by John Gruber in 2004 with the goal of being...

### Core Syntax Elements

**Headers**:
```markdown
# H1 Header
## H2 Header
### H3 Header
```

**Formatting**:
- Bold: `**bold text**`
- Italic: `*italicized text*`
- Code: `` `code` ``

...

## Advanced Markdown Techniques

### Tables

...

### Code Blocks with Syntax Highlighting

...

## Conclusion

Markdown's simplicity and versatility make it an essential skill for technical writers and developers. By mastering the techniques covered in this guide, you'll be able to create clear, consistent, and professional documentation.

## Further Resources

- [Official Markdown Guide](mdc:https:/www.markdownguide.org)
- [GitHub Flavored Markdown](mdc:https:/github.github.com/gfm)
- [Our Previous Article: Documentation Best Practices](mdc:2022/12/10/documentation-best-practices)
```

## Using time-mcp Tools for Timestamps

When setting the date in your front matter, always use the time-mcp tool to get the current time:

```
<function_calls>
<invoke name="mcp_time-mcp_current_time">
<parameter name="format">YYYY-MM-DD HH:mm:ss