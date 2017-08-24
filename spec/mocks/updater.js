/** @babel */

export default {
  updateError () {
    soldat.autoUpdater.emitter.emit('update-error')
  },

  checkForUpdate () {
    soldat.autoUpdater.emitter.emit('did-begin-checking-for-update')
  },

  updateNotAvailable () {
    soldat.autoUpdater.emitter.emit('update-not-available')
  },

  downloadUpdate () {
    soldat.autoUpdater.emitter.emit('did-begin-downloading-update')
  },

  finishDownloadingUpdate (releaseVersion) {
    soldat.autoUpdater.emitter.emit('did-complete-downloading-update', {releaseVersion})
  }
}
