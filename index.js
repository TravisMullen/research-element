/* global HTMLElement:false, CustomEvent: false */
const template = document.createElement('template')

template.innerHTML = `
      <style>
        :host {
          all: initial;
          display: block;
          contain: content;
        }
      </style>
      <section>
        <h1></h1>
      </section>
    `

export class ResearchElement extends HTMLElement {
  constructor () {
    super()
    /** @todo - test custom property */
    /** @todo - test nested/deep shadow DOM */

    // set some defaults and expose them for testing unchanged state
    // can also be used to check immutable data/properties

    // todo :: test/handle objects values on properties
    Object.defineProperty(this, 'defaults', {
      value: Object.freeze({
        headline: 'Default headline text.',
        color: '#444',
        eventDelay: 2000
      }),
      enumerable: true,
      writable: false,
      configurable: false
    })

    Object.defineProperty(this, 'immutable', {
      value: 'this value cannot be changed.',
      enumerable: true,
      writable: false,
      configurable: false
    })

    Object.defineProperty(this, 'deep', {
      value: {
        mutable: 'this value can be changed.',
        immutable: 'this value can still be changed.',
        propertyWithoutAttributeMapping: 'another value that can be changed.'
      },
      enumerable: true,
      writable: false,
      configurable: false
    })

    Object.defineProperty(this.deep, 'immutable', {
      value: 'now this value cannot be changed.',
      enumerable: true,
      writable: false,
      configurable: false
    })

    Object.defineProperty(this, 'nonenumerable', {
      value: 'JSON.stringify() cannot see me.',
      enumerable: false,
      writable: true,
      configurable: false
    })

    // to be manipulated without setAttribute/observedAttributes
    // will be passed in event for test scenario that is more than just a property value check
    this.propertyWithoutAttributeMapping = 'some default value'

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.headlineElement = this.shadowRoot.querySelector('h1')
    this.colorElement = this.shadowRoot.querySelector('section')
  }

  connectedCallback () {
    if (!this.hasAttribute('headline')) {
      this.setAttribute('headline', this.defaults.headline)
    }
    if (!this.hasAttribute('color')) {
      this.setAttribute('color', this.defaults.color)
    }
  }

  static get observedAttributes () {
    return ['headline', 'color', 'trigger']
  }

  attributeChangedCallback (name, previous, value) {
    if (name === 'headline') {
      this.headlineElement.innerText = this.headline
    }
    if (name === 'color') {
      this.colorElement.style.backgroundColor = this.color
    }
    if (name === 'trigger') {
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent('example-event', {
          detail: {
            name,
            value,
            previous,
            propertyWithoutAttributeMapping: this.propertyWithoutAttributeMapping,
            deepPropertyWithoutAttributeMapping: this.deep.propertyWithoutAttributeMapping
          },
          bubbles: true,
          composed: true,
          cancelable: true
        }))
      }, this.defaults.eventDelay)
    }
  }

  get headline () {
    return this.getAttribute('headline')
  }

  set headline (newValue) {
    this.setAttribute('headline', newValue)
  }

  get trigger () {
    return 'this does get a value from an attribute'
  }

  set trigger (newValue) {
    return 'no attributes or property values were changed.'
  }

  get color () {
    return this.getAttribute('color')
  }

  set color (newValue) {
    this.setAttribute('color', newValue)
  }
}

window.customElements.define('research-element', ResearchElement)
