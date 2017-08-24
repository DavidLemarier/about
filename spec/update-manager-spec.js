/** @babel */

import UpdateManager from '../lib/update-manager'

describe('UpdateManager', () => {
  let updateManager

  beforeEach(() => {
    updateManager = new UpdateManager()
  })

  describe('::getReleaseNotesURLForVersion', () => {
    it('returns soldat.io releases when dev version', () => {
      expect(updateManager.getReleaseNotesURLForVersion('1.7.0-dev-e44b57d')).toContain('soldat.io/releases')
    })

    it('returns the page for the release when not a dev version', () => {
      expect(updateManager.getReleaseNotesURLForVersion('1.7.0')).toContain('soldat/soldat/releases/tag/v1.7.0')
      expect(updateManager.getReleaseNotesURLForVersion('v1.7.0')).toContain('soldat/soldat/releases/tag/v1.7.0')
      expect(updateManager.getReleaseNotesURLForVersion('1.7.0-beta10')).toContain('soldat/soldat/releases/tag/v1.7.0-beta10')
    })
  })
})
