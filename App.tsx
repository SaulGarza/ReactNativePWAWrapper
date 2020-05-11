/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import DeviceInfo from 'react-native-device-info';
import Main from './src/components/Main';
import {AppProps} from './src/types';

// import { getWebViewUserAgent } from 'react-native-user-agent'

const interpolateYayNay = (
  stringBool?: 'YES' | 'NO',
  defaultReturn: boolean = true,
) => {
  if (!stringBool) {
    return defaultReturn;
  }
  return stringBool === 'YES' ? true : false;
};

export default class App extends React.PureComponent<
  AppProps,
  {userAgent: string}
> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      userAgent: '',
    };
  }
  componentDidMount() {
    DeviceInfo.getUserAgent()
      .then((userAgent: string) => this.setState({userAgent}))
      .catch((err: any) => {
        console.log('Could not get user agent! :(', err);
        this.setState({userAgent: 'unknown'});
      });
  }
  render() {
    if (this.state.userAgent === '') {
      return null;
    }
    // Prepare Application Props
    const {app_id, version, other_postfix, build_version} = this.props.postfix;
    let userAgent = `${DeviceInfo.getUserAgentSync()} webRTCAdapterEnabled`;
    if (app_id) {
      userAgent = `${userAgent} ${app_id}`;
      if (version) {
        userAgent = `${userAgent}@${version}`;
        if (build_version) {
          userAgent = `${userAgent} (${build_version})`;
        }
      }
    }
    if (other_postfix) {
      userAgent = `${userAgent} ${other_postfix}`;
    }
    let props = {
      ...this.props,
      userAgent,
      enableMixedContentMode: interpolateYayNay(
        this.props.enableMixedContentMode,
      ),
      pushMobileWebpageMeta: interpolateYayNay(
        this.props.pushMobileWebpageMeta,
      ),
      disableWebpageZoom: interpolateYayNay(this.props.disableWebpageZoom),
      fullscreen: interpolateYayNay(this.props.fullscreen, false),
      forceOfflineFullscreen: interpolateYayNay(
        this.props.forceOfflineFullscreen,
      ),
    };
    delete props.postfix;
    return <Main {...props} />;
  }
}
