/**
 * WebView Component
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  Text,
  View,
  NativeSyntheticEvent,
  WebViewMessageEventData,
  Image,
  Linking,
  LinkingIOS,
  Alert,
} from 'react-native';
import generateStyles from '../styles';
let styles: any

import CustomOfflineComponent from './CustomOfflineComponent'

import { AudioRecorder, AudioUtils } from 'react-native-audio'
import { WebView } from 'react-native-webview'
import { AppConstants } from '../types'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

const offlineImage = require('../assets/offline_image.png')

interface IState {
  currentTime: number
  recording: boolean
  paused: boolean
  stoppedRecording: boolean
  finished: boolean
  audioPath?: string
  hasPermission?: boolean
}
export default class WebViewContainer extends Component<AppConstants, IState> {
  public state = {
    currentTime: 0.0,
    recording: false,
    paused: false,
    stoppedRecording: false,
    finished: false,
    audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
    hasPermission: undefined,
  }
  private webView: any

  private prepareRecordingPath(audioPath: string){
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: this.props.audioQuality,
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
      IncludeBase64: true,
      MeteringEnabled: true,
      // MeasurementMode: true,
    });
  }
  constructor(props: AppConstants) {
    super(props)
    styles = generateStyles(props)
  }
  public componentDidMount() {
    AudioRecorder.requestAuthorization().then((isAuthorised) => {
      this.setState({ hasPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath(this.state.audioPath);

      this.webView

      AudioRecorder.onProgress = (data: {
        currentTime: number, // Current time in seconds
        currentPeakMetering: number, // Maximum Volume in Decibels
        currentMetering: number, // Avg Volume in Decibels
      }) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
        console.log('Current Time: ', data.currentTime, data)
        this.webView.postMessage(JSON.stringify({
          name: 'progress',
          time: data.currentTime * 1000,
          currentMetering: data.currentMetering,
          currentPeakMetering: data.currentPeakMetering,
        }))
      };

      AudioRecorder.onFinished = (data) => {
        if (Platform.OS === 'ios') {
          this.finishRecording(data.status === "OK", data.base64);
        } else {
          this.finishRecording(true, data.base64)
        }
      };
    });
  }

  private async stop() {
    if (!this.state.recording) return

    this.setState({stoppedRecording: true, recording: false, paused: false});

    try {
      await AudioRecorder.stopRecording();
    } catch (error) {
      console.error(error);
    }
  }

  private async record() {
    if (this.state.recording) return
    if (!this.state.hasPermission) return
    if(this.state.stoppedRecording) this.prepareRecordingPath(this.state.audioPath);

    this.setState({recording: true, paused: false});

    try {
      const filePath = await AudioRecorder.startRecording();
      this.webView.postMessage(JSON.stringify({ name: 'start' }))
    } catch (error) {
    }
  }

  private finishRecording(didSucceed: boolean, encoding: string) {
    this.setState({ finished: didSucceed });
    this.webView.postMessage(JSON.stringify({ name: 'stop', blob: encoding }))
  }

  private renderOfflineWidget(e: string | undefined) {
    return (
      <View style={styles.errorImageContainer}>
        <StatusBar barStyle={this.props.offlineBarStyle || this.props.barStyle}/>
        {this.props.offlineLoadingType === 'text' && <Text style={styles.errorText}>Could not connect to Server</Text>}
        {this.props.offlineLoadingType === 'image' && !!offlineImage && <Image source={offlineImage} style={styles.errorImage} resizeMode='contain'/> }
        {this.props.offlineLoadingType === 'custom' && <CustomOfflineComponent />}
      </View>
    )
  }

  private renderSpinner() {
    return (
      <View style={styles.errorTextContainer}>
        <ActivityIndicator
          animating={true}
          color={this.props.colors.spinner}
          size={'small'}
        />
      </View>
    );
  }

  private onMessage(e: NativeSyntheticEvent<WebViewMessageEventData>) {
    const { data } = e.nativeEvent
    switch(data) {
      case 'start': this.record()
        break
      case 'stop': this.stop()
        break
    }
  }

  public render() {
    const correctScreenSizing = this.props.pushMobileWebpageMeta ? 'width=device-width' : null
    const disableZoom = this.props.disableWebpageZoom ? 'maximum-scale=1.0' : null
    const contentMeta = this.props.pushMobileWebpageMeta || this.props.disableWebpageZoom ?
    ` const meta = document.createElement('meta');
      meta.setAttribute('content', '${correctScreenSizing}, initial-scale=1.0, ${disableZoom}');
      meta.setAttribute('name', 'viewport');
      document.getElementsByTagName('head')[0].appendChild(meta); true
    ` : null
    const INJECTED_JAVASCRIPT = `
      navigator.allowBridgedWebRTC = 'microphone'
      ${contentMeta}
    `
    console.log('PROPS: ', this.props)
    return (
      <View style={styles.container}>
        <StatusBar barStyle={this.props.barStyle}/>
        <WebView
          ref={(component) => this.webView = component}
          source={{ uri: this.props.url }}
          useWebKit
          allowFileAccess
          startInLoadingState
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          style={styles.webView}
          domStorageEnabled={true}
          // scalesPageToFit={Platform.OS === 'android' ? false : true}
          
          originWhitelist={['*']}
          
          javaScriptEnabled={true}
          onMessage={e => this.onMessage(e)}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          renderError={(e) => this.renderOfflineWidget(e)}
          renderLoading={() => this.renderSpinner()}
          mixedContentMode={this.props.enableMixedContentMode ? 'compatibility' : 'never'}
          userAgent={this.props.userAgent}
          bounces={false}
          onShouldStartLoadWithRequest={(navigator) => {
            const { url } = navigator
            if(
              this.props.domainOriginTestPattern &&
              url.indexOf(this.props.domainOriginTestPattern) === -1
            ) {
              this.webView.stopLoading()
              Linking.canOpenURL(url).then((supported) => {
                if (!supported) {
                  if(__DEV__) {
                    Alert.alert(`Can't open url: ${url}`)
                  } else {
                    `Can't open url: ${url}`
                  }
                } else {
                  Linking.openURL(url)
                }
              }).catch((reason) => {
                return false
              })
              return false
            } else {
              return true
            }
          }}

          // {...{
          //   onNavigationStateChange: (navState: WebViewNavigation) => {
          //     try {
          //       const { url } = navState
          //       const hasWhitelistPattern = !!this.props.domainOriginTestPattern
          //       if(hasWhitelistPattern) {
          //         const isWhitelistedURL = url.includes(this.props.domainOriginTestPattern!)
          //         if(isWhitelistedURL) {
          //           return true
          //         } else {
          //           Linking.canOpenURL(url).then((supported) => {
          //             if (!supported) {
          //               Alert.alert(`Can't open url: ${url}`)
          //             } else {
          //               Linking.openURL(url)
          //             }
          //           }).catch((reason) => {
          //             throw 'Couldnt open url?'
          //           })
          //           return false
          //         }
          //       }
          //       return false
          //     } catch (e) {
          //       console.log(e)
          //       return false
          //     }
          //   },
          // }}
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