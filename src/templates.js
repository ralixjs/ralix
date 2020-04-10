export default class Templates {
  constructor(templates) {
    this.templates = templates
  }

  render(template, data) {
    const tmpl = this.templates[template]

    if (tmpl)
      return tmpl.call(this, data)
    else
      throw new Error(`[Ralix] Template '${template}' not found`)
  }
}
