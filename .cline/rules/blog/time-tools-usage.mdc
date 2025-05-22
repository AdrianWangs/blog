---
description:
globs:
alwaysApply: false
---
# Using Time Tools in Blog Posts

## Importance of Consistent Timestamps

When creating or editing blog posts, it's crucial to use the correct timestamps for the `date` and `updated` fields in the front matter. This ensures:

1. Consistent publication dates across all posts
2. Proper sorting in archives and category pages
3. Accurate "last updated" information

## How to Use time-mcp Tools

Always use the time-mcp tools to get the current time when creating or updating posts. These tools provide the correct network time rather than relying on potentially incorrect local system time.

### Getting the Current Time

When you need the current date and time for a new post or to update the `updated` field, use the `mcp_time-mcp_current_time` tool:

```
// Format: Use YYYY-MM-DD HH:mm:ss for blog post timestamps
<function_calls>
<invoke name="mcp_time-mcp_current_time">
<parameter name="format">YYYY-MM-DD HH:mm:ss
