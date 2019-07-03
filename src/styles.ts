import {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'
import constants from './constants';

var styles = function() {
  var {height, width} = Dimensions.get('window');
  var webViewMarginTop = Platform.select({
    ios: isIphoneX()
      ? 44
      : 20,
    android: 20,
  });

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    webView: {
      margin: 0,
      marginTop: webViewMarginTop,
      height: height - webViewMarginTop,
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
  });
};

export default styles;