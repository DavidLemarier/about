/** @babel */
/** @jsx etch.dom */
/* eslint-disable react/no-unknown-property */

import {Disposable} from 'soldat'
import etch from 'etch'
import shell from 'shell'
import SoldatLogo from './soldat-logo'
import EtchComponent from '../etch-component'
import UpdateView from './update-view'

export default class AboutView extends EtchComponent {
  handleVersionClick (e) {
    e.preventDefault()
    soldat.clipboard.write(this.props.currentVersion)
  }

  handleReleaseNotesClick (e) {
    e.preventDefault()
    shell.openExternal(this.props.updateManager.getReleaseNotesURLForAvailableVersion())
  }

  handleLicenseClick (e) {
    e.preventDefault()
    soldat.commands.dispatch(soldat.views.getView(soldat.workspace), 'application:open-license')
  }

  handleTermsOfUseClick (e) {
    e.preventDefault()
    shell.openExternal('https://help.github.com/articles/github-terms-of-service')
  }

  render () {
    return (
      <div className='pane-item native-key-bindings about'>
        <div className='about-container'>
          <header className='about-header'>
            <a className='about-soldat-io' href='https://soldat.io/'>
              <SoldatLogo />
            </a>
            <div className='about-header-info'>
              <span className='about-version-container inline-block' onclick={this.handleVersionClick.bind(this)}>
                <span className='about-version'>{this.props.currentVersion} {process.arch}</span>
                <span className='icon icon-clippy about-copy-version' />
              </span>
              <a className='about-header-release-notes' onclick={this.handleReleaseNotesClick.bind(this)}>Release Notes</a>
            </div>
          </header>

          <UpdateView updateManager={this.props.updateManager} availableVersion={this.props.availableVersion} viewUpdateReleaseNotes={this.handleReleaseNotesClick.bind(this)} />

          <div className='about-actions group-item'>
            <div className='btn-group'>
              <button className='btn view-license' onclick={this.handleLicenseClick.bind(this)}>License</button>
              <button className='btn terms-of-use' onclick={this.handleTermsOfUseClick.bind(this)}>Terms of Use</button>
            </div>
          </div>

          <div className='about-love group-start'>
            <span className='icon icon-code' />
            <span className='inline'> with </span>
            <span className='icon icon-heart' />
            <span className='inline'> by </span>
            <a className='icon icon-logo-github' href='https://github.com' />
          </div>

          <div className='about-credits group-item'>
            <span className='inline'>And the awesome </span>
            <a href='https://github.com/soldat/soldat/contributors'>Soldat Community</a>
          </div>
        </div>
      </div>
    )
  }

  serialize () {
    return {
      deserializer: this.constructor.name,
      uri: this.props.uri
    }
  }

  onDidChangeTitle () {
    return new Disposable()
  }

  onDidChangeModified () {
    return new Disposable()
  }

  getTitle () {
    return 'About'
  }

  getIconName () {
    return 'info'
  }
}
