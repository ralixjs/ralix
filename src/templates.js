export default class Templates {
  constructor(templates) {
    this.templates = templates || {}
  }

  render(template, data) {
    const tmpl = this.templates[template]

    if (tmpl) {
      const output = tmpl.call(this, data)

      // Handle null and undefined values in output by replacing them with empty string
      if (typeof output === 'string') {
        return output.replace(/\bnull\b/g, '').replace(/\bundefined\b/g, '')
      }

      return output
    } else {
      throw new Error(`[Ralix] Template '${template}' not found`)
    }
  }
}
