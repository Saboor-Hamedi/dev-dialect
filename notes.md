# Markdown Implementation Guide

## Installation

Install the required packages:

```bash
npm install react-markdown remark-gfm rehype-highlight
```

**Packages:**

- `react-markdown` - Renders markdown in React
- `remark-gfm` - GitHub Flavored Markdown support
- `rehype-highlight` - Syntax highlighting for code blocks

## How to Display Markdown

### Basic Usage

```javascript
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
  {yourMarkdownContent}
</ReactMarkdown>;
```

### With Proper Spacing

```javascript
<div className="prose prose-lg dark:prose-invert max-w-none [&>pre]:my-6 [&>p]:my-4 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:mt-6 [&>h3]:mb-3">
  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
    {yourMarkdownContent}
  </ReactMarkdown>
</div>
```

**Spacing Classes:**

- `[&>pre]:my-6` - Space around code blocks
- `[&>p]:my-4` - Space between paragraphs
- `[&>h2]:mt-8 [&>h2]:mb-4` - Space around H2 headings
- `[&>h3]:mt-6 [&>h3]:mb-3` - Space around H3 headings

## Markdown Syntax Examples

### Headers

```markdown
# H1 Header

## H2 Header

### H3 Header
```

### Text Formatting

```markdown
**Bold text**
_Italic text_
~~Strikethrough~~
```

### Code Blocks with Syntax Highlighting

Use triple backticks with language name:

````markdown
```javascript
function hello() {
  console.log("Hello World");
}
```
````

````markdown
```python
def greet():
    print("Hello World")
```
````

````markdown
```sql
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
```
````

**Supported Languages:** `javascript`, `typescript`, `python`, `java`, `html`, `css`, `sql`, `bash`, `json`, etc.

### Inline Code

```markdown
Use `const` instead of `var`
```

### Lists

**Unordered:**

```markdown
- Item 1
- Item 2
  - Nested item
```

**Ordered:**

```markdown
1. First item
2. Second item
```

**Task Lists:**

```markdown
- [x] Completed task
- [ ] Incomplete task
```

### Links and Images

```markdown
[Link text](https://example.com)
![Image alt](https://example.com/image.jpg)
```

### Blockquotes

```markdown
> This is a blockquote
> Multiple lines
```

### Tables

```markdown
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
```

### Horizontal Rule

```markdown
---
```

## Troubleshooting

### Code Not Highlighting?

Make sure to use triple backticks with a language identifier:

````markdown
```javascript
// code here
```
````

### No Spacing Between Elements?

Add the spacing classes to the container:

```javascript
className = "... [&>pre]:my-6 [&>p]:my-4 ...";
```

## Available Highlight.js Themes

Change the theme by importing a different CSS file:

```javascript
// Dark themes
import "highlight.js/styles/github-dark.css";
import "highlight.js/styles/monokai.css";
import "highlight.js/styles/atom-one-dark.css";

// Light themes
import "highlight.js/styles/github.css";
import "highlight.js/styles/atom-one-light.css";
```

Browse all themes: `node_modules/highlight.js/styles/`
