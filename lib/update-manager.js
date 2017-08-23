/** @babel */

import {Emitter, CompositeDisposable} from 'soldat'

const Unsupported = 'unsupported'
const Idle = 'idle'
const CheckingForUpdate = 'checking'
const DownloadingUpdate = 'downloading'
const UpdateAvailableToInstall = 'update-available'
const UpToDate = 'no-update-available'
const ErrorState = 'error'

export default class UpdateManager {
  constructor () {
    this.emitter = new Emitter()
    this.currentVersion = soldat.getVersion()
    this.availableVersion = soldat.getVersion()
    this.resetState()
    this.listenForSoldatEvents()
  }

  listenForSoldatEvents () {
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(
      soldat.autoUpdater.onDidBeginCheckingForUpdate(() => {
        this.setState(CheckingForUpdate)
      }),
      soldat.autoUpdater.onDidBeginDownloadingUpdate(() => {
        this.setState(DownloadingUpdate)
      }),
      soldat.autoUpdater.onDidCompleteDownloadingUpdate(({releaseVersion}) => {
        this.setAvailableVersion(releaseVersion)
      }),
      soldat.autoUpdater.onUpdateNotAvailable(() => {
        this.setState(UpToDate)
      }),
      soldat.autoUpdater.onUpdateError(() => {
        this.setState(ErrorState)
      }),
      soldat.config.observe('core.automaticallyUpdate', (value) => {
        this.autoUpdatesEnabled = value
        this.emitDidChange()
      })
    )

    // TODO: When https://github.com/soldat/electron/issues/4587 is closed we can add this support.
    // soldat.autoUpdater.onUpdateAvailable =>
    //   @find('.about-updates-item').removeClass('is-shown')
    //   @updateAvailable.addClass('is-shown')
  }

  dispose () {
    this.subscriptions.dispose()
  }

  onDidChange (callback) {
    return this.emitter.on('did-change', callback)
  }

  emitDidChange () {
    this.emitter.emit('did-change')
  }

  getAutoUpdatesEnabled () {
    return this.autoUpdatesEnabled && this.state !== UpdateManager.State.Unsupported
  }

  setAutoUpdatesEnabled (enabled) {
    return soldat.config.set('core.automaticallyUpdate', enabled)
  }

  getErrorMessage () {
    return soldat.autoUpdater.getErrorMessage()
  }

  getState () {
    return this.state
  }

  setState (state) {
    this.state = state
    this.emitDidChange()
  }

  resetState () {
    this.state = soldat.autoUpdater.platformSupportsUpdates() ? soldat.autoUpdater.getState() : Unsupported
    this.emitDidChange()
  }

  getAvailableVersion () {
    return this.availableVersion
  }

  setAvailableVersion (version) {
    this.availableVersion = version

    if (this.availableVersion !== this.currentVersion) {
      this.state = UpdateAvailableToInstall
    } else {
      this.state = UpToDate
    }

    this.emitDidChange()
  }

  checkForUpdate () {
    soldat.autoUpdater.checkForUpdate()
  }

  restartAndInstallUpdate () {
    soldat.autoUpdater.restartAndInstallUpdate()
  }

  getReleaseNotesURLForCurrentVersion () {
    return this.getReleaseNotesURLForVersion(this.currentVersion)
  }

  getReleaseNotesURLForAvailableVersion () {
    return this.getReleaseNotesURLForVersion(this.availableVersion)
  }

  getReleaseNotesURLForVersion (appVersion) {
    // Dev versions will not have a releases page
    if (appVersion.indexOf('dev') > -1) {
      return 'https://soldat.io/releases'
    }

    if (!appVersion.startsWith('v')) {
      appVersion = `v${appVersion}`
    }
    return `https://github.com/soldat/soldat/releases/tag/${appVersion}`
  }
}

UpdateManager.State = {
  Unsupported: Unsupported,
  Idle: Idle,
  CheckingForUpdate: CheckingForUpdate,
  DownloadingUpdate: DownloadingUpdate,
  UpdateAvailableToInstall: UpdateAvailableToInstall,
  UpToDate: UpToDate,
  Error: ErrorState
}
