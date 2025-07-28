export const template1 = (text = "default") => `<div>${text}</div>`
export const template2 = ({ title }) => `<h1>${title}</h1>`

// XSS testing templates
export const userContent = (data) => `<div>User says: ${data.message}</div>`
export const scriptInjection = (data) => `<p>${data.content}</p>`
export const attributeInjection = (data) => `<img src="${data.src}" alt="${data.alt}">`
export const complexTemplate = (data) => `
  <div class="card">
    <h1>${data.title}</h1>
    <p>${data.description}</p>
    <a href="${data.link}">Click here</a>
  </div>
`

// Template for testing that template structure is preserved
export const templateStructureTest = (data) => `
  <script type="application/json">${JSON.stringify(data)}</script>
  <div onclick="handleClick()">
    <p>User content: ${data.userContent}</p>
    <img src="${data.userImage}" onerror="fallback()">
  </div>
`
