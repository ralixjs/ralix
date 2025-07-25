# Security Features

## XSS Prevention

Ralix.js now includes built-in protections against Cross-Site Scripting (XSS) attacks through secure HTML insertion and escaping utilities.

### Secure HTML Insertion

Use `insertHTMLSafe()` instead of `insertHTML()` when dealing with user-controlled content:

```javascript
// ❌ Vulnerable to XSS
insertHTML('#content', userInput)

// ✅ Safe - escapes malicious content  
insertHTMLSafe('#content', userInput)
```

### HTML Escaping Utility

The `escapeHTML()` function safely escapes HTML characters:

```javascript
const userInput = '<script>alert("XSS")</script>'
const safe = escapeHTML(userInput)
// Result: '&lt;script&gt;alert("XSS")&lt;/script&gt;'
```

### Secure Templates

Templates can use the `escape()` method to safely handle user input:

```javascript
export const userProfile = function({ name, bio }) {
  return `
    <div class="profile">
      <h2>${this.escape(name)}</h2>
      <p>${this.escape(bio)}</p>
    </div>
  `
}
```

### API Reference

- `insertHTMLSafe(query, html, position)` - Securely insert HTML content
- `insertHTMLUnsafe(query, html, position)` - Explicitly use legacy behavior  
- `escapeHTML(str)` - Escape HTML characters in a string
- Templates: `this.escape(str)` - Escape user content in templates

### Migration Guide

1. **Immediate**: Replace `insertHTML()` with `insertHTMLSafe()` for user content
2. **Templates**: Use `this.escape()` for any user-provided data
3. **Review**: Audit existing code for potential XSS vulnerabilities

### Backward Compatibility

The original `insertHTML()` function remains unchanged to ensure backward compatibility. Use `insertHTMLUnsafe()` to be explicit about potentially unsafe usage.