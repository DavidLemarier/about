/** @babel */
/** @jsx etch.dom */
/* eslint-disable react/no-unknown-property */

import {CompositeDisposable} from 'soldat'
import etch from 'etch'
import EtchComponent from '../etch-component'

export default class AboutStatusBar extends EtchComponent {
  constructor () {
    super()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(soldat.tooltips.add(this.element, {title: 'An update will be installed the next time Soldat is relaunched.<br/><br/>Click the squirrel icon for more information.'}))
  }

  handleClick () {
    soldat.workspace.open('soldat://about')
  }

  render () {
    return (
      <span type='button' className='about-release-notes icon icon-squirrel inline-block' onclick={this.handleClick.bind(this)} />
    )
  }

  destroy () {
    super.destroy()
    this.subscriptions.dispose()
  }
}
