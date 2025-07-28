export const template1 = (text = "default") => `<div>${text}</div>`
export const template2 = ({ title }) => `<h1>${title}</h1>`

// XSS testing templates
export const attributeInjection = (data) => `<img src="${data.src}" alt="${data.alt}">`
export const structureTemplate = (data) => `
  <script type="application/json">${JSON.stringify(data)}</script>
  <div onclick="handleClick()">
    <p>User content: ${data.userContent}</p>
    <img src="${data.userImage}" onerror="fallback()">
  </div>
`
export const nestedTemplate = (data) => `
  <div>
    <h1>${data.user.name}</h1>
    <p>${data.user.profile.bio}</p>
    <ul>
      ${data.items.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>
`
export const primitiveTemplate = (data) => `
  <div>
    <p>${data.message}</p>
    <span>Count: ${data.count}</span>
    <span>Active: ${data.isActive}</span>
    <span>Null: ${data.nullValue}</span>
    <span>Undefined: ${data.undefinedValue}</span>
  </div>
`
