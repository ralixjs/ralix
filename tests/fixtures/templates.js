export const template1 = (text = "default") => `<div>${text}</div>`
export const template2 = ({ title }) => `<h1>${title}</h1>`

// Example of a safe template that escapes user input
export const safeUserProfile = function({ name, bio }) {
  return `
    <div class="user-profile">
      <h2>${this.escape(name)}</h2>
      <p class="bio">${this.escape(bio)}</p>
    </div>
  `
}

// Example of an unsafe template (demonstrates vulnerability)
export const unsafeUserProfile = ({ name, bio }) => `
  <div class="user-profile">
    <h2>${name}</h2>
    <p class="bio">${bio}</p>
  </div>
`
