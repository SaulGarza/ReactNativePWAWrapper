import {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'
import { AppConstants } from './types';

const generateStyles = function(props: AppConstants) {
  var {height, width} = Dimensions.get('window');
  var webViewMarginTop = Platform.select({
    ios: isIphoneX()
      ? 44
      : 20,
    android: 20,
  });

  let offlineFullscreen = props.forceOfflineFullscreen || props.fullscreen

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props.colors.backgroundColor,
    },
    webView: {
      margin: 0,
      ...(props.fullscreen ? { marginTop: webViewMarginTop } : null),
      height: props.fullscreen ? height - webViewMarginTop : height,
      width: width,
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    errorTextContainer: {
      margin: 0,
      position: 'absolute',
      left: 0,
      top: 0,
      ...(!offlineFullscreen ? { marginTop: webViewMarginTop } : null),
      height: !offlineFullscreen ? height - webViewMarginTop : height,
      width: width,
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      backgroundColor: props.colors.primary,
    },
    errorText: {
      fontWeight: '600' as '600',
      color: props.colors.text,
    },
    errorImageContainer: {
      margin: 0,
      position: 'absolute',
      left: 0,
      top: 0,
      ...(!offlineFullscreen ? { marginTop: webViewMarginTop } : null),
      height: !offlineFullscreen ? height - webViewMarginTop : height,
      width: width,
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      backgroundColor: props.colors.primary,
    },
    errorImage: {
      maxWidth: width,
      maxHeight: !offlineFullscreen ? height - webViewMarginTop : height
    }
  });
};

export default generateStyles;