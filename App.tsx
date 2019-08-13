/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 * 
 * @format
 */

import React from 'react'
import Main from './src/components/Main'
import { AppProps, AppConstants } from './src/types'

import { getWebViewUserAgent } from 'react-native-user-agent'

const interpolateYayNay = (stringBool?: 'YES' | 'NO', defaultReturn: boolean = true) => {
  if(!stringBool) return defaultReturn
  return stringBool === 'YES' ? true : false
}

export default class App extends React.PureComponent<AppProps> {
  render() {
    // Prepare Application Props
    const { app_id, version, other_postfix} = this.props.postfix
    const postfixString = `${app_id}${version ? `@${version}` : null}${other_postfix ? ` ${other_postfix}` : null}`
    let props = {
      ...this.props,
      userAgent: `${getWebViewUserAgent()} webRTCAdapterEnabled ${postfixString}`,
      enableMixedContentMode: interpolateYayNay(this.props.enableMixedContentMode),
      pushMobileWebpageMeta: interpolateYayNay(this.props.pushMobileWebpageMeta),
      disableWebpageZoom: interpolateYayNay(this.props.disableWebpageZoom),
      fullscreen: interpolateYayNay(this.props.fullscreen, false),
      forceOfflineFullscreen: interpolateYayNay(this.props.forceOfflineFullscreen),
    }
    delete props.postfix
    return (
      <Main {...props}/>
    );
  }
}
