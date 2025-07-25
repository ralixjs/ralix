# Security Considerations for Ralix.js

This document outlines security considerations and best practices when using Ralix.js.

## Template Rendering Security 🛡️

**✅ PROTECTED**: The `render` helper is now protected against XSS attacks.

### Automatic XSS Protection

The template rendering system automatically sanitizes all template output using DOMPurify:

```js
// ✅ SAFE: XSS content is automatically removed
const userInput = '<script>alert("XSS")</script>Hello'
render('userTemplate', { message: userInput })
// Result: '<div>Hello</div>' (script tag removed)
```

### What is Protected

- **Script injection**: `<script>` tags are completely removed
- **Event handlers**: `onerror`, `onload`, `onclick`, etc. are stripped
- **JavaScript URLs**: `javascript:` URLs are neutralized
- **Data URLs with scripts**: Malicious data URLs are sanitized
- **Null/undefined values**: Automatically converted to empty strings

### What is Preserved

Safe HTML elements and attributes are preserved:

```js
// ✅ SAFE: These elements are preserved
const safeHTML = '<strong>Bold</strong> and <em>italic</em> text'
render('template', { content: safeHTML })
// Result: '<div><strong>Bold</strong> and <em>italic</em> text</div>'
```

## Event Binding Security ⚠️

**⚠️ REQUIRES ATTENTION**: The automatic event binding system has security implications.

### How Event Binding Works

Ralix automatically binds JavaScript event handlers from HTML attributes:

```html
<!-- This HTML attribute becomes executable JavaScript -->
<button onclick="doSomething()">Click me</button>
```

### Security Implications

1. **Trusted Content Only**: Event binding should only be used with HTML you control
2. **Not for User Content**: Never use with HTML from user input or external sources
3. **Server-Side Templates**: Safe when used with server-side rendered templates you control

### Best Practices

**✅ SAFE Usage:**
```html
<!-- Server-side template you control -->
<button onclick="showModal()">Open Modal</button>
<input onkeyup="search()" placeholder="Search...">
```

**❌ UNSAFE Usage:**
```js
// DON'T: Insert user HTML with event handlers
const userHTML = '<img onerror="alert(1)" src="bad.jpg">'
insertHTML('#container', userHTML) // This would be dangerous without insertHTML's protection
```

**✅ SAFE Alternative:**
```js
// DO: Use controlled event binding
insertHTML('#container', '<img src="user-image.jpg">') // insertHTML sanitizes this
on('#container img', 'error', () => handleImageError())
```

### Recommendations

1. **Use `insertHTML` for user content**: It automatically sanitizes dangerous event handlers
2. **Use direct event binding for user interactions**: Prefer `on()` helper over inline handlers for dynamic content
3. **Validate server templates**: Ensure your server-side templates don't include unsanitized user data in event handlers

## Global Helper Injection Security 🔧

**ℹ️ INFORMATIONAL**: Global helper injection has minimal security impact but some considerations.

### How It Works

Ralix injects all helper methods into the global `window` object:

```js
// These become globally available:
window.find = helpers.find
window.addClass = helpers.addClass
window.insertHTML = helpers.insertHTML
// ... etc
```

### Potential Issues

1. **Namespace Pollution**: Could override existing global functions
2. **Method Override**: Malicious code could override Ralix helpers

### Current Mitigations

- Only injects during app initialization
- Binds methods to original context
- Methods are already defensive (check for element existence, etc.)

### Future Enhancements

Consider adding options to control global injection:

```js
// Potential future API
const app = new RalixApp({
  helpers: {
    global: false, // Don't inject into window
    whitelist: ['find', 'addClass'], // Only inject specific methods
    prefix: 'ralix_' // Prefix all global methods
  }
})
```

## Additional Security Best Practices 

### 1. Content Security Policy (CSP)

Consider implementing CSP headers to prevent XSS:

```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self'; object-src 'none';">
```

### 2. Input Validation

Always validate and sanitize data on the server-side before it reaches the client.

### 3. Regular Updates

Keep Ralix and its dependencies (especially DOMPurify) updated to receive security fixes.

### 4. Security Testing

The project includes comprehensive security tests. Run them regularly:

```bash
npm test -- --testPathPattern=security.test.js
```

## Reporting Security Issues

If you discover a security vulnerability in Ralix, please report it responsibly by:

1. **DO NOT** create a public GitHub issue
2. Email the maintainers directly
3. Provide detailed information about the vulnerability
4. Include steps to reproduce if possible

## Summary

- ✅ **Template rendering** is now fully protected against XSS
- ⚠️ **Event binding** requires careful use with trusted content only
- ℹ️ **Global injection** has minimal risk but could be improved
- 🛡️ **insertHTML** was already protected and remains secure

Ralix now provides strong security defaults while maintaining its ease of use and flexibility.