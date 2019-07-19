# PWA React Native Wrapper
This project is a fully customizable iOS WebView that adds a WebRTC Audio adapter. Additionaly in the future, this project could extend to cover more features than even WebRTC supports, such as:
* Background Geolocation
* Local and Remote Push Notifications
* Camera & Video
* request on-device Contacts
* etc.

The Caveat to that is that some of these features, since they are not in WebRTC in general, would also need the android build to cover those solutions.

## Prerequisites
* Familiarity with xCode
* Familiarity with App Store Connect
* App Icons ready in seperate folder (As of the time of this writing requires the following image sizes)
  * `AppIcon20pt@2x.png` - iPhone Notification [iOS 7-12]: width/height = 40px
  * `AppIcon20pt@3x.png` - iPhone Notification [iOS 7-12]: width/height = 60px
  * `AppIcon29pt@2x.png` - iPhone Settings [iOS 7-12]: width/height = 58px
  * `AppIcon29pt@3x.png` - iPhone Settings [iOS 7-12]: width/height = 87px
  * `AppIcon40pt@2x.png` - iPhone Spotlight [iOS 7-12]: width/height = 80px
  * `AppIcon40pt@3x.png` - iPhone Spotlight [iOS 7-12]: width/height = 120px
  * `AppIcon60pt@2x.png` - iPhone App [iOS 7-12]: width/height = 120px
  * `AppIcon60pt@3x.png` - iPhone App [iOS 7-12]: width/height = 180px
  * `AppIcon@1x.png` - App Store [iOS 7-12]: width/height = 1024px
* splash_image set ready in seperate folder
  * `splash_image@1x.png` - any size, prefer anything up to 320px x 320px to cover all phone sizes, I use 250px x 250px because I like a nice clean look
  * `splash_image@2x.png` - any size, traditionally 2x of @1x
  * `splash_image@3x.png` - any size, traditionally 3x of @1x
* offline_image set ready in seperate folder (If you choose to use an offline image)
  * `offline_image@1x.png` - any size, prefer 320px x 320px to cover all phone sizes
  * `offline_image@2x.png` - any size, traditionally 2x of @1x
  * `offline_image@3x.png` - any size, traditionally 3x of @1x
* An app bundle id ready to use for this app.

## File Structure
Files to note here
```
/
  android/ /* Android not set up: see the Android section */
  ios/
    PWAReactNativeWrapper.xcworkspace
    Podfile /* If you add new bridged modules, use cocoapod installation methods */
  src/
    assets/
      offline_image@1x.png
      offline_image@2x.png
      offline_image@3x.png
    components/
      CustomOfflineComponent.tsx /* if you extend this project */
      WebViewComponent.tsx
  node_modules/ /* if you extend this project: `$ yarn` to add dependencies*/
```

## Getting Started

Clone or fork the repo as needed

Open the `.xcworkspace` file in xCode

### xCode

#### Navigate to the project target,

Reassign the `Bundle Identifier` and `Display Name` to whatever you want. In the case of your `Bundle Identifier`, you should use reverse domain notation. eg: For Coop Dreams you could denote it: `app.getvoxi.coopdreams`

Change the `Team` in the Target > Signing Section

#### Navigate to the Project's `info.plist`

Change the `Privacy - Location When in Use Description` and `Privacy - Microphone Usage Description` to reflect the App's name

#### Navigate to the Project's `Images.xcassets`

replace the AppIcon and splash_image resources with the matching images you prepared earlier

#### Navigate to the Project Target's `Build Settings > User-Defined`, Located at the bottom of the Build Settings

This is the app's configuration. Each Setting can be defined for both debug and release schemes. or just for both. this is useful for local testing and quality control.

The settings should be defined according to these typings:

```
// Quality of Recorded Audio, trades filesize for quality.
AudioQuality: ["Low", "Medium", "High"]
  /* Default Values */
  -> Debug: Low
  -> Release: Medium

// Color of Error Text if OfflineLoadingType = "text"
ColorSettingsErrorText: color

// Color of Loading Spinner
ColorSettingsLoadingSpinner: color

// Background color of OfflineLoadingType = "text" | "image"
ColorSettingsPrimary: color

// Background color of StatusBar when not in fullscreen
ColorSettingsStatusBar: color

// These 3 inject meta tags and help with mobile sizing, If you have mobile sizing solutions on your PWA you can disable these
DisableWebpageZoom: ["YES", "NO"] = YES
PushMobileWebpageMeta: ["YES", "NO"] = YES
EnableMixedContentMode: ["YES", "NO"] = YES

// when set, opens external urls in Safari, the test pattern tests whether urls are permitted within the app. for production make sure to include the whole domain of the app, eg: https://coopdreams.getvoxi.com
DomainOriginTestPattern?: string

// When Fullscreen is disabled, It displays the statusBar background color as defined in ColorSettingsStatusBar
Fullscreen: ["YES", "NO"] = YES
// Optional: inherits Fullscreen when unset
FullscreenWhenOffline?: ["YES", "NO"]

//Screen to show when offline
OfflineLoadType: ["text", "image", "custom"] = "image"

// Color of Status Bar Text. default will guess based on the screen contents
StatusBarStyle: ["default", "light-content", "dark-content"]
// Color of Status Bar Text when offline, inherits StatusBarStyle when unset
StatusBarOfflineType?: ["default", "light-content", "dark-content"]

// UAPostfixes append to the end of the user agent
//  eg: `${userAgent} WebRTCAdapterEnabled ${SettingAppId}@${SettingVersion} ${ExtraData}`
UAPostfixSettingAppId?: string
UAPostfixSettingVersion?: number
UAPostfixExtraData?: string

// Site URL to load
WebRTCAdapterSettingURL: string
```

#### Navigate to the Project's `LaunchScreen.xib`

Here, you should now see your splash_image in the middle of a colored square.

Select the `View` element and navigate to it's Attribute Inspector, and change the `Background` to whatever color you want,

If the splash_image is not 250px x 250px, the Image here is not sized properly, change the Image's dimensions to reflect the splash_image@1x.png dimensions

### Project Directory

#### Navigate to `/src/assets/`

If `OfflineLoadType = 'image'`, replace the `offline_image`'s with whatever offline image you prepared

### Publishing (back to xCode)

#### Navigate to the project target

Each time you publish a new build to the app store, make sure to increment the build number or the `Build Settings > User Defined > UAPostfixSettingVersion` or Apple will not allow the push.

#### Navigate to `Product > Scheme > Edit Scheme...`

Switch the `Build Configuration` from Debug to Release

#### Next Steps

Once tested on a physical device and you are sure you'd like to publish, switch the build target to `Generic iOS Device`

Publish to the app store from `Product > Archive`

Wait for the archive to finish and upload to App Store Connect

## Extending JS
I moved the project configuration from compiled typescript to xCode in order to eliminate the npm / yarn dependency and eliminate the need to compile any JS code. If you would like to extend this and change the compiled main.jsbundle, you will need to run `npm i` or `yarn` in the project directory to download all node_modules

Utilizing the CustomOfflineComponent requires this option.

## Building for Android
iOS inherently blocks WebViews from exposing WebRTC Camera and Microphone, however, android doesn't have this same problem, so this same project will run the same on android, but use the PWA's normal WebRTC api to get Mic information.

The issue with building for android is that I haven't linked the RCT Bridged Modules to the android build. Once that is done, it will run just as good on android devices with this same repo.
