import React from 'react';
import WebViewComponent from './WebViewComponent';
import {AppConstants} from '../types';

export default class Main extends React.Component<AppConstants, {}> {
  render() {
    return <WebViewComponent {...this.props} />;
  }
}
