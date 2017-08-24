/** @babel */

import {it, fit, ffit, fffit, beforeEach, afterEach} from './helpers/async-spec-helpers' // eslint-disable-line no-unused-vars

describe('About', () => {
  let workspaceElement

  beforeEach(async () => {
    let storage = {}

    spyOn(window.localStorage, 'setItem').andCallFake((key, value) => {
      storage[key] = value
    })
    spyOn(window.localStorage, 'getItem').andCallFake((key) => {
      return storage[key]
    })

    workspaceElement = soldat.views.getView(soldat.workspace)
    await soldat.packages.activatePackage('about')
  })

  it('deserializes correctly', () => {
    let deserializedAboutView = soldat.deserializers.deserialize({
      deserializer: 'AboutView',
      uri: 'soldat://about'
    })

    expect(deserializedAboutView).toBeTruthy()
  })

  describe('when the about:about-soldat command is triggered', () => {
    it('shows the About Soldat view', async () => {
      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement)

      expect(workspaceElement.querySelector('.about')).not.toExist()
      await soldat.workspace.open('soldat://about')

      let aboutElement = workspaceElement.querySelector('.about')
      expect(aboutElement).toBeVisible()
    })
  })

  describe('when the version number is clicked', () => {
    it('copies the version number to the clipboard', async () => {
      await soldat.workspace.open('soldat://about')

      let aboutElement = workspaceElement.querySelector('.about')
      let versionContainer = aboutElement.querySelector('.about-version-container')
      versionContainer.click()
      expect(soldat.clipboard.read()).toBe(soldat.getVersion())
    })
  })
})
