/**
 * WebView Component
 */

import React, { Component } from 'react';
import {
  // WebView,
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  NativeSyntheticEvent,
  WebViewMessageEventData,
  NavState,
  Alert,
} from 'react-native';
import styles from '../styles';
import constants from '../constants';

import Permissions from 'react-native-permissions'

import { WebView } from 'react-native-webview'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class WebViewContainer extends Component<{}> {
  private webView: any
  renderOfflineWidget() {
    return (
      <View style={styles().welcome}>
        <Text style={styles().welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles().instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles().instructions}>
          {instructions}
        </Text>
      </View>
    );
  }

  renderSpinner() {
    return (
      <View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center' as 'center', alignItems: 'center' as 'center'}}>
        <ActivityIndicator
          animating={true}
          color={constants.colors.primary}
          size={'small'}
        />
      </View>
    );
  }

  onMessage(e: NativeSyntheticEvent<WebViewMessageEventData>) {
    console.log('Message Received', e, this.webView)
  }

  onLoadStart(e: NavState) {
    console.log('Load Started!', e, this.webView)
  }
  onLoadEnd(e: NavState) {
    console.log('Load Ended!', e, this.webView)
    Permissions.check('microphone').then(res => {
      console.log('check resolution: ', res)
      if(res === 'restricted' || res === 'undetermined') {
        Permissions.request('microphone').then(res => {
          console.log('request resolution: ', res)
          if(res !== 'authorized') {
            Alert.alert('microphone access not authorized')
          }
        })
      } else if(res === 'denied') {
        Alert.alert('To use this app, you must enable Microphone Permissions in Settings > App > Microphone Access')
      }
    })
  }

  render() {
    // const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); true`
    const INJECTED_JAVASCRIPT = `
      (function() {
        console.log('Window: ', window)
        if (!window.navigator) window.navigator = { mediaDevices: {} };
        window.navigator.mediaDevices.getUserMedia = function() {
          webkit.messageHandlers.callbackHandler.postMessage(arguments);
        }
        console.log(window.navigator.getUserMedia, window.navigator, window)
        if(window.navigator.getUserMedia) {
          console.log(window.navigator.getUserMedia())
        }
      })();
    `
    return (
      <View style={styles().container}>
        <StatusBar barStyle="dark-content"/>
        <WebView
          ref={(component) => this.webView = component}
          // source={{uri: 'https://demo.getvoxi.app'}}
          // source={{ uri: 'file:///Users/saul/Projects/PWAReactNativeWrapper/local/index.html' }}
          source={{ uri: 'https://bdc929ca.ngrok.io'}}
          // source={{ uri: 'https://marcusbelcher.github.io/wasm-asm-camera-webgl-test/index.html'}}
          useWebKit
          allowFileAccess
          startInLoadingState
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          // source={{uri: 'https://mobilehtml5.org/ts/?id=23'}}
          
          style={styles().webView}
          domStorageEnabled={true}
          // scalesPageToFit={Platform.OS === 'android' ? false : true}
          onLoadStart={e => this.onLoadStart(e)}
          onLoadEnd={e => this.onLoadEnd(e)}
          
          originWhitelist={['*']}

          javaScriptEnabled={true}
          onMessage={e => this.onMessage(e)}
          // injectedJavaScript={INJECTED_JAVASCRIPT}
          renderError={(e) => this.renderOfflineWidget()}
          renderLoading={() => this.renderSpinner()}
          mixedContentMode={constants.enableMixedContentMode ? 'compatibility' : 'never'}
          userAgent={constants.userAgent}
          bounces={false}
          
        />
      </View>
    );
  }

/**
Maybe useful:

onShouldStartLoadWithRequest?: function (iOS)
Function that allows custom handling of any web view requests.
Return true from the function to continue loading the request and false to stop loading.

onError?: function
Function that is invoked when the WebView load fails.

onLoad?: function
Function that is invoked when the WebView has finished loading.

onLoadEnd?: function
Function that is invoked when the WebView load succeeds or fails.

onLoadStart?: function
Function that is invoked when the WebView starts loading.

onNavigationStateChange?: function
Function that is invoked when the WebView loading starts or ends.

renderError?: function
Function that returns a view to show if there's an error.

renderLoading?: function
Function that returns a loading indicator.

dataDetectorTypes?: (iOS)
  enum('phoneNumber', 'link', 'address', 'calendarEvent', 'none', 'all'),
  [enum('phoneNumber', 'link', 'address', 'calendarEvent', 'none', 'all')]
Determines the types of data converted to clickable URLs in the web view’s content.
By default only phone numbers are detected. You can provide one type or an array of many types.
*/
}