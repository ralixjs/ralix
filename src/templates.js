import Helpers from './helpers'

const helpers = new Helpers()

export default class Templates {
  constructor(templates) {
    this.templates = templates || {}
  }

  render(template, data) {
    const tmpl = this.templates[template]

    if (tmpl) {
      // Sanitize the input data to prevent XSS attacks in variables
      const sanitizedData = this._sanitizeData(data)
      const output = tmpl.call(this, sanitizedData)

      // Handle null and undefined values in output by replacing them with empty string
      if (typeof output === 'string') {
        return output.replace(/\bnull\b/g, '').replace(/\bundefined\b/g, '')
      }

      return output
    } else {
      throw new Error(`[Ralix] Template '${template}' not found`)
    }
  }

  // Deep sanitize data object to prevent XSS in variables
  _sanitizeData(data) {
    if (data === null || data === undefined) {
      return data
    }

    if (typeof data === 'string') {
      let sanitized = helpers.sanitize(data)

      // Additional sanitization for patterns that DOMPurify doesn't catch in standalone strings
      if (/^\s*(javascript|vbscript|data\s*:\s*text\/html)/i.test(sanitized)) {
        return ''
      }

      return sanitized
    }

    if (Array.isArray(data)) {
      return data.map(item => this._sanitizeData(item))
    }

    if (typeof data === 'object') {
      const sanitized = {}
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this._sanitizeData(value)
      }
      return sanitized
    }

    // For primitives (numbers, booleans, etc.), return as-is
    return data
  }
}
