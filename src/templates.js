import DOMPurify from 'dompurify'

export default class Templates {
  constructor(templates) {
    this.templates = templates || {}
  }

  render(template, data) {
    const tmpl = this.templates[template]

    if (tmpl) {
      const output = tmpl.call(this, data)
      
      // Sanitize the template output to prevent XSS attacks
      if (typeof output === 'string') {
        // Handle null and undefined values by replacing them with empty string
        const cleanedOutput = output.replace(/\bnull\b/g, '').replace(/\bundefined\b/g, '')
        return DOMPurify.sanitize(cleanedOutput)
      }
      
      return output
    } else {
      throw new Error(`[Ralix] Template '${template}' not found`)
    }
  }
}
