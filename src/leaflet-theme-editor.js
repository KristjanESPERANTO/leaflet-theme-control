import { DomEvent, DomUtil } from 'leaflet'
import { DEFAULT_THEMES } from './leaflet-theme-control-themes.js'

/**
 * ThemeEditor - UI for selecting and editing themes
 *
 * Provides a theme selector with individual theme editors.
 * Allows users to customize CSS filters for each theme with sliders
 * and save preferences to localStorage.
 */
export class ThemeEditor {
  constructor(themeControl) {
    this.themeControl = themeControl
    this.panel = null
    this.isOpen = false
    this.currentView = 'selector' // 'selector' or 'editor'
    this.editingTheme = null

    // Storage key for custom filters
    this.storageKey = `${themeControl.options.storageKey}-custom-filters`

    // Load custom filters from localStorage
    this.customFilters = this._loadCustomFilters()

    // Apply custom filters to themes
    this._applyCustomFilters()
  }

  /**
   * Create DOM element with children (like React's createElement)
   * @param {string} tag - HTML tag name
   * @param {object} attrs - Attributes (class, id, data-*, aria-*, etc)
   * @param {...(Node|string)} children - Child nodes or text
   * @returns {HTMLElement} Created element
   */
  _el(tag, attrs = {}, ...children) {
    const element = document.createElement(tag)

    // Set attributes
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value
      }
      else if (key.startsWith('data-')) {
        element.setAttribute(key, value)
      }
      else if (key.startsWith('aria-')) {
        element.setAttribute(key, value)
      }
      else {
        element[key] = value
      }
    })

    // Append children
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child))
      }
      else if (child instanceof Node) {
        element.appendChild(child)
      }
    })

    return element
  }

  _loadCustomFilters() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : {}
    }
    catch (e) {
      console.error('Failed to load custom filters:', e)
      return {}
    }
  }

  _saveCustomFilters() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.customFilters))
    }
    catch (e) {
      console.error('Failed to save custom filters:', e)
    }
  }

  _applyCustomFilters() {
    Object.keys(this.customFilters).forEach((themeKey) => {
      if (this.themeControl.options.themes[themeKey]) {
        const custom = this.customFilters[themeKey]
        this.themeControl.options.themes[themeKey].filter = this._buildFilterString(custom)

        // Apply control style if saved
        if (custom.controlStyle) {
          this.themeControl.options.themes[themeKey].controlStyle = custom.controlStyle
        }
      }
    })
  }

  createPanel() {
    const panel = DomUtil.create('div', 'leaflet-theme-panel')
    panel.style.display = 'none'
    panel.setAttribute('role', 'dialog')
    panel.setAttribute('aria-modal', 'true')
    panel.setAttribute('aria-labelledby', 'theme-panel-title')

    // Apply position and z-index from options
    const position = this.themeControl.options.panelPosition || 'topright'
    panel.setAttribute('data-position', position)
    panel.style.zIndex = this.themeControl.options.panelZIndex || 1000

    // Prevent map interactions when using the panel
    DomEvent.disableClickPropagation(panel)
    DomEvent.disableScrollPropagation(panel)

    this.panel = panel

    // Close on ESC key
    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close()
      }
    }

    return panel
  }

  _getLabel(key) {
    // Use custom label function if provided
    if (this.themeControl.options.getEditorLabels) {
      return this.themeControl.options.getEditorLabels(key)
    }

    // Default labels
    const labels = {
      selectTheme: 'Select Theme',
      customize: 'Customize',
      close: 'Close',
      back: 'Back',
      resetToDefault: 'Reset to Default',
      customizeTheme: 'Customize this theme',
      customBadge: 'Custom',
      controlStyle: 'Control Style',
      lightControls: 'Light',
      darkControls: 'Dark',
      invert: 'Invert',
      hueRotate: 'Hue Rotate',
      saturate: 'Saturate',
      brightness: 'Brightness',
      contrast: 'Contrast',
      sepia: 'Sepia',
      grayscaleFilter: 'Grayscale',
    }

    return labels[key] || key
  }

  openThemeSelector() {
    if (!this.panel) return

    this.isOpen = true
    this.currentView = 'selector'
    this.panel.style.display = 'block'
    this._renderThemeSelector()

    // Add keyboard listener
    document.addEventListener('keydown', this._onKeyDown)

    // Focus first interactive element
    setTimeout(() => {
      const firstBtn = this.panel.querySelector('.theme-select-btn')
      if (firstBtn) firstBtn.focus()
    }, 50)
  }

  openThemeEditor(themeKey) {
    if (!this.panel) return

    this.currentView = 'editor'
    this.editingTheme = themeKey
    this._renderThemeEditor(themeKey)

    // Focus first slider
    setTimeout(() => {
      const firstSlider = this.panel.querySelector('input[type="range"]')
      if (firstSlider) firstSlider.focus()
    }, 50)
  }

  // Alias for easier API usage
  open() {
    this.openThemeSelector()
  }

  close() {
    if (!this.panel) return

    this.isOpen = false
    this.panel.style.display = 'none'
    this.currentView = 'selector'
    this.editingTheme = null

    // Remove keyboard listener
    document.removeEventListener('keydown', this._onKeyDown)
  }

  _isThemeModified(themeKey) {
    // Check if theme has custom filters saved
    if (!this.customFilters[themeKey]) {
      return false
    }

    // Get default theme from DEFAULT_THEMES
    const defaultTheme = DEFAULT_THEMES[themeKey]
    if (!defaultTheme) {
      // Custom theme not in defaults - consider it modified
      return true
    }

    // Parse default filter and compare with custom
    const defaultValues = this._parseFilterString(defaultTheme.filter)
    const customValues = this.customFilters[themeKey]

    // Check if any filter value differs from default
    const filterKeys = ['invert', 'hueRotate', 'saturate', 'brightness', 'contrast', 'sepia', 'grayscale']
    const filtersModified = filterKeys.some((key) => {
      const defaultVal = defaultValues[key]
      const customVal = customValues[key] !== undefined ? customValues[key] : defaultVal
      return Math.abs(customVal - defaultVal) > 0.01 // Use small epsilon for float comparison
    })

    // Check if control style differs
    const controlStyleModified = customValues.controlStyle && customValues.controlStyle !== defaultTheme.controlStyle

    return filtersModified || controlStyleModified
  }

  cleanup() {
    // Close panel if open
    if (this.isOpen) {
      this.close()
    }

    // Remove keyboard listener (in case close() wasn't called)
    if (this._onKeyDown) {
      document.removeEventListener('keydown', this._onKeyDown)
      this._onKeyDown = null
    }

    // Remove panel from DOM
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel)
    }

    // Clear all references
    this.panel = null
    this.themeControl = null
    this.customFilters = null
  }

  _renderThemeSelector() {
    const currentTheme = this.themeControl.getCurrentTheme()
    const themes = this.themeControl.options.themes

    // Build panel header
    const header = this._createPanelHeader(this._getLabel('selectTheme'))

    // Build theme rows
    const body = this._el('div', {
      'className': 'theme-panel-body',
      'role': 'radiogroup',
      'aria-label': this._getLabel('selectTheme'),
    })
    Object.keys(themes).forEach((themeKey) => {
      const row = this._createThemeRow(themeKey, themes[themeKey], themeKey === currentTheme)
      body.appendChild(row)
    })

    // Replace panel content
    this.panel.replaceChildren(header, body)

    // Attach event listeners
    this._attachSelectorListeners()
  }

  _createPanelHeader(title, showBackButton = false) {
    const header = this._el('div', { className: 'theme-panel-header' })

    if (showBackButton) {
      const backBtn = this._el('button', {
        'className': 'theme-panel-back',
        'aria-label': this._getLabel('back'),
      }, '←')
      header.appendChild(backBtn)
    }

    const h3 = this._el('h3', { id: 'theme-panel-title' }, title)
    header.appendChild(h3)

    const closeBtn = this._el('button', {
      'className': 'theme-panel-close',
      'aria-label': this._getLabel('close'),
    }, '×')
    header.appendChild(closeBtn)

    return header
  }

  _createThemeRow(themeKey, theme, isActive) {
    const hasCustom = this._isThemeModified(themeKey)
    const themeLabel = this.themeControl._getThemeLabel(themeKey)

    // Create select button with icon, label and badges
    const selectBtn = this._el('button', {
      'className': 'theme-select-btn',
      'data-theme': themeKey,
      'role': 'radio',
      'aria-checked': isActive ? 'true' : 'false',
      'aria-label': themeLabel,
    })

    selectBtn.appendChild(this._el('span', { 'className': 'theme-icon', 'aria-hidden': 'true' }, theme.icon || '🎨'))
    selectBtn.appendChild(this._el('span', { className: 'theme-name' }, themeLabel))

    if (hasCustom) {
      selectBtn.appendChild(this._el('span', { className: 'theme-custom-badge' }, this._getLabel('customBadge')))
    }

    if (isActive) {
      selectBtn.appendChild(this._el('span', { 'className': 'theme-active-badge', 'aria-hidden': 'true' }, '✓'))
    }

    // Create edit button
    const editBtn = this._el('button', {
      'className': 'theme-edit-btn',
      'data-theme': themeKey,
      'aria-label': `${this._getLabel('customizeTheme')}: ${themeLabel}`,
    }, '⚙️')

    // Create row container
    const row = this._el('div', {
      'className': `theme-row ${isActive ? 'active' : ''}`,
      'data-theme': themeKey,
    })
    row.appendChild(selectBtn)
    row.appendChild(editBtn)

    return row
  }

  _attachSelectorListeners() {
    // Close button
    const closeBtn = this.panel.querySelector('.theme-panel-close')
    DomEvent.on(closeBtn, 'click', () => this.close())

    // Theme select buttons
    const selectBtns = this.panel.querySelectorAll('.theme-select-btn')
    selectBtns.forEach((btn, index) => {
      DomEvent.on(btn, 'click', (e) => {
        const themeKey = e.currentTarget.dataset.theme

        // Update aria-checked states
        selectBtns.forEach(b => b.setAttribute('aria-checked', 'false'))
        e.currentTarget.setAttribute('aria-checked', 'true')

        this.themeControl.setTheme(themeKey)
        this.close()
      })

      // Keyboard navigation for theme buttons
      DomEvent.on(btn, 'keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault()
          const nextIndex = (index + 1) % selectBtns.length
          selectBtns[nextIndex].focus()
        }
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault()
          const prevIndex = (index - 1 + selectBtns.length) % selectBtns.length
          selectBtns[prevIndex].focus()
        }
      })
    })

    // Theme edit buttons
    const editBtns = this.panel.querySelectorAll('.theme-edit-btn')
    editBtns.forEach((btn) => {
      DomEvent.on(btn, 'click', (e) => {
        DomEvent.stop(e)
        const themeKey = e.currentTarget.dataset.theme
        this.openThemeEditor(themeKey)
      })
    })
  }

  _renderThemeEditor(themeKey) {
    const theme = this.themeControl.options.themes[themeKey]
    const themeLabel = this.themeControl._getThemeLabel(themeKey)

    // Get current filter values or defaults
    const filterValues = this.customFilters[themeKey] || this._parseFilterString(theme.filter)

    // Get control style preference - always start fresh from theme
    // Don't check customFilters first, as it may have stale data
    const controlStyle = theme.controlStyle || 'light'

    // Build panel structure
    const header = this._createPanelHeader(`${this._getLabel('customize')}: ${themeLabel}`, true)
    const body = this._createEditorBody(filterValues, controlStyle)
    const footer = this._createEditorFooter()

    // Replace panel content
    this.panel.replaceChildren(header, body, footer)

    // Attach event listeners
    this._attachEditorListeners(themeKey, filterValues, controlStyle)
  }

  _createControlStyleSelector(controlStyle) {
    const selector = this._el('div', { className: 'control-style-selector' })

    const label = this._el('label', {}, this._getLabel('controlStyle'))
    selector.appendChild(label)

    const buttonsContainer = this._el('div', { className: 'control-style-buttons' })

    const lightBtn = this._el('button', {
      'className': `control-style-btn ${controlStyle === 'light' ? 'active' : ''}`,
      'data-style': 'light',
    }, `☀️ ${this._getLabel('lightControls')}`)

    const darkBtn = this._el('button', {
      'className': `control-style-btn ${controlStyle === 'dark' ? 'active' : ''}`,
      'data-style': 'dark',
    }, `🌙 ${this._getLabel('darkControls')}`)

    buttonsContainer.appendChild(lightBtn)
    buttonsContainer.appendChild(darkBtn)
    selector.appendChild(buttonsContainer)

    return selector
  }

  _createEditorBody(filterValues, controlStyle) {
    const body = this._el('div', { className: 'theme-panel-body theme-editor-sliders' })

    // Control style selector
    body.appendChild(this._createControlStyleSelector(controlStyle))

    // Filter sliders
    body.appendChild(this._createSlider('invert', filterValues.invert || 0, 0, 1, 0.1))
    body.appendChild(this._createSlider('hueRotate', filterValues.hueRotate || 0, 0, 360, 1, '°'))
    body.appendChild(this._createSlider('saturate', filterValues.saturate || 1, 0, 2, 0.1))
    body.appendChild(this._createSlider('brightness', filterValues.brightness || 1, 0, 2, 0.1))
    body.appendChild(this._createSlider('contrast', filterValues.contrast || 1, 0, 2, 0.1))
    body.appendChild(this._createSlider('sepia', filterValues.sepia || 0, 0, 1, 0.1))
    body.appendChild(this._createSlider('grayscale', filterValues.grayscale || 0, 0, 1, 0.1))

    return body
  }

  _createEditorFooter() {
    const footer = this._el('div', { className: 'theme-panel-footer' })
    const resetBtn = this._el('button', { className: 'theme-editor-reset' }, this._getLabel('resetToDefault'))
    footer.appendChild(resetBtn)
    return footer
  }

  _createSlider(key, value, min, max, step, unit = '') {
    const label = this._getLabel(key)

    return this._el('div', { className: 'theme-editor-slider' },
      this._el('label', { htmlFor: `slider-${key}` },
        this._el('span', { className: 'slider-label' }, label),
        this._el('span', { 'className': 'slider-value', 'data-key': key }, `${value}${unit}`),
      ),
      this._el('input', {
        'type': 'range',
        'id': `slider-${key}`,
        'data-key': key,
        'min': String(min),
        'max': String(max),
        'step': String(step),
        'value': String(value),
        'aria-label': `${label}: ${value}${unit}`,
        'aria-valuemin': String(min),
        'aria-valuemax': String(max),
        'aria-valuenow': String(value),
      }),
    )
  }

  _attachEditorListeners(themeKey, initialValues, initialControlStyle) {
    // Back button
    const backBtn = this.panel.querySelector('.theme-panel-back')
    DomEvent.on(backBtn, 'click', () => this.openThemeSelector())

    // Close button
    const closeBtn = this.panel.querySelector('.theme-panel-close')
    DomEvent.on(closeBtn, 'click', () => this.close())

    // Control style buttons
    let currentControlStyle = initialControlStyle
    const controlStyleBtns = this.panel.querySelectorAll('.control-style-btn')
    controlStyleBtns.forEach((btn) => {
      DomEvent.on(btn, 'click', (e) => {
        const style = e.currentTarget.dataset.style
        currentControlStyle = style

        // Update active state
        controlStyleBtns.forEach(b => b.classList.remove('active'))
        e.currentTarget.classList.add('active')

        // Live preview and save
        this.themeControl.root.setAttribute('data-control-style', style)
        this._saveTheme(themeKey, currentValues, currentControlStyle)
      })
    })

    // Sliders
    const sliders = this.panel.querySelectorAll('input[type="range"]')
    const currentValues = { ...initialValues }

    sliders.forEach((slider) => {
      DomEvent.on(slider, 'input', (e) => {
        const key = e.target.dataset.key
        const value = parseFloat(e.target.value)
        currentValues[key] = value

        // Update display value
        const valueDisplay = this.panel.querySelector(`.slider-value[data-key="${key}"]`)
        const unit = key === 'hueRotate' ? '°' : ''
        valueDisplay.textContent = value + unit

        // Update aria-valuenow and aria-label
        e.target.setAttribute('aria-valuenow', value)
        e.target.setAttribute('aria-label', `${this._getLabel(key)}: ${value}${unit}`)

        // Live preview and save
        this._previewFilter(themeKey, currentValues)
        this._saveTheme(themeKey, currentValues, currentControlStyle)
      })
    })

    // Reset button
    const resetBtn = this.panel.querySelector('.theme-editor-reset')
    DomEvent.on(resetBtn, 'click', () => {
      this._resetTheme(themeKey)
    })
  }

  _previewFilter(themeKey, values) {
    const filterString = this._buildFilterString(values)

    // Temporarily update the filter
    const elements = document.querySelectorAll(this.themeControl.options.cssSelector)
    elements.forEach((el) => {
      el.style.filter = filterString
    })
  }

  _saveTheme(themeKey, values, controlStyle) {
    this.customFilters[themeKey] = {
      ...values,
      controlStyle: controlStyle,
    }
    this._saveCustomFilters()

    // Update theme
    const filterString = this._buildFilterString(values)
    this.themeControl.options.themes[themeKey].filter = filterString
    this.themeControl.options.themes[themeKey].controlStyle = controlStyle

    // Reapply current theme if it's the one being edited
    if (this.themeControl.getCurrentTheme() === themeKey) {
      this.themeControl.setTheme(themeKey)
    }

    // Fire onChange callback for editor changes
    if (this.themeControl.options.onChange) {
      this.themeControl.options.onChange(themeKey, this.themeControl.options.themes[themeKey])
    }
  }

  _resetTheme(themeKey) {
    // Remove custom filter and controlStyle
    delete this.customFilters[themeKey]
    this._saveCustomFilters()

    // Restore default filter and controlStyle from DEFAULT_THEMES
    // but KEEP user-defined properties like applyToSelectors
    const defaultTheme = DEFAULT_THEMES[themeKey]
    const currentTheme = this.themeControl.options.themes[themeKey]

    if (defaultTheme && currentTheme) {
      // Only reset the editable properties (filter, controlStyle)
      // Keep other properties like applyToSelectors, icon, label, className
      currentTheme.filter = defaultTheme.filter
      currentTheme.controlStyle = defaultTheme.controlStyle
    }
    else if (!currentTheme) {
      // Theme doesn't exist - this shouldn't happen
      console.warn(`Theme "${themeKey}" not found`)
      return
    }
    else {
      // For custom themes not in DEFAULT_THEMES, we can't reset
      console.warn(`Theme "${themeKey}" has no default in DEFAULT_THEMES, cannot reset filter values`)
    }

    // Reapply theme if it's currently active
    // Use setTheme to ensure proper application
    if (this.themeControl.getCurrentTheme() === themeKey) {
      this.themeControl.setTheme(themeKey)
    }
    else {
      // Fire onChange callback even if theme is not currently active
      if (this.themeControl.options.onChange) {
        this.themeControl.options.onChange(themeKey, this.themeControl.options.themes[themeKey])
      }
    }

    // Re-render editor panel with default values
    this._renderThemeEditor(themeKey)
  }

  _buildFilterString(values) {
    const parts = []

    if (values.invert > 0) parts.push(`invert(${values.invert})`)
    if (values.hueRotate !== 0) parts.push(`hue-rotate(${values.hueRotate}deg)`)
    if (values.saturate !== 1) parts.push(`saturate(${values.saturate})`)
    if (values.brightness !== 1) parts.push(`brightness(${values.brightness})`)
    if (values.contrast !== 1) parts.push(`contrast(${values.contrast})`)
    if (values.sepia > 0) parts.push(`sepia(${values.sepia})`)
    if (values.grayscale > 0) parts.push(`grayscale(${values.grayscale})`)

    return parts.join(' ')
  }

  _parseFilterString(filterString) {
    if (!filterString) {
      return {
        invert: 0,
        hueRotate: 0,
        saturate: 1,
        brightness: 1,
        contrast: 1,
        sepia: 0,
        grayscale: 0,
      }
    }

    const values = {
      invert: 0,
      hueRotate: 0,
      saturate: 1,
      brightness: 1,
      contrast: 1,
      sepia: 0,
      grayscale: 0,
    }

    // Parse each filter function
    const invertMatch = filterString.match(/invert\(([\d.]+)\)/)
    if (invertMatch) values.invert = parseFloat(invertMatch[1])

    const hueMatch = filterString.match(/hue-rotate\(([\d.]+)deg\)/)
    if (hueMatch) values.hueRotate = parseFloat(hueMatch[1])

    const saturateMatch = filterString.match(/saturate\(([\d.]+)\)/)
    if (saturateMatch) values.saturate = parseFloat(saturateMatch[1])

    const brightnessMatch = filterString.match(/brightness\(([\d.]+)\)/)
    if (brightnessMatch) values.brightness = parseFloat(brightnessMatch[1])

    const contrastMatch = filterString.match(/contrast\(([\d.]+)\)/)
    if (contrastMatch) values.contrast = parseFloat(contrastMatch[1])

    const sepiaMatch = filterString.match(/sepia\(([\d.]+)\)/)
    if (sepiaMatch) values.sepia = parseFloat(sepiaMatch[1])

    const grayscaleMatch = filterString.match(/grayscale\(([\d.]+)\)/)
    if (grayscaleMatch) values.grayscale = parseFloat(grayscaleMatch[1])

    return values
  }
}
