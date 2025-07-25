export default class Templates {
  constructor(templates) {
    this.templates = templates || {}
  }

  render(template, data) {
    const tmpl = this.templates[template]

    if (tmpl)
      return tmpl.call(this, data)
    else
      throw new Error(`[Ralix] Template '${template}' not found`)
  }

  escapeHTML(str) {
    if (typeof str !== 'string') return str
    
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  // Utility function for templates to safely escape user content
  escape(str) {
    return this.escapeHTML(str)
  }
}
