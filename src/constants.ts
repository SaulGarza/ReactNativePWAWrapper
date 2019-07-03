import { ObjectOf } from './types'
import { getWebViewUserAgent } from 'react-native-user-agent'

/**
 * App Constants and Settings
 */

const colors: ObjectOf<string> = {
  primary: '#dc143c',
}

// Setup User Agent
const userAgent: string = getWebViewUserAgent()
const postfix = {
  app_id: 'ReactNativeApp',
  version: '0.1.0',
  other_postfix: ''
}

const constants = {
  colors,
  userAgent: `${userAgent} ${postfix.app_id}/${postfix.version} ${postfix.other_postfix}`,
  enableMixedContentMode: true,
};

export default constants;