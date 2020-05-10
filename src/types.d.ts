export interface ObjectOf<T> {
  [key: string]: T;
}

export enum BarStyle {
  'default' = 'default',
  'dark-content' = 'dark-content',
  'light-content' = 'light-content',
}

export enum AudioQuality {
  'Low' = 'Low',
  'Medium' = 'Medium',
  'High' = 'High',
}

export type StringBool = 'YES' | 'NO';

type Props = {
  colors: {
    primary: string;
    text: string;
    backgroundColor: string;
    spinner: string;
  };
  SafariLinkingDisallowed3rdPartyUrls: string[];
  domainOriginTestPattern?: string;
  url: string;
  audioQuality: AudioQuality;
  barStyle: BarStyle;
  offlineBarStyle?: BarStyle;
  offlineLoadingType: 'image' | 'text' | 'custom';
};

export type AppProps = {
  postfix: {
    app_id: string;
    version?: string;
    other_postfix?: string;
  };
  enableMixedContentMode: StringBool;
  pushMobileWebpageMeta: StringBool;
  disableWebpageZoom: StringBool;
  fullscreen: StringBool;
  forceOfflineFullscreen: StringBool;
} & Props;

export type AppConstants = {
  userAgent: string;
  enableMixedContentMode: boolean;
  pushMobileWebpageMeta: boolean;
  disableWebpageZoom: boolean;
  fullscreen: boolean;
  forceOfflineFullscreen: boolean;
} & Props;
