# PWA React Native Wrapper
This project is a fully customizable iOS WebView that adds a WebRTC Audio adapter. Additionaly in the future, this project could extend to cover more features than even WebRTC supports, such as:
* Background Geolocation
* Local and Remote Push Notifications
* Camera & Video
* request on-device Contacts
* etc.

The Caveat to that is that some of these features, since they are not in WebRTC in general, would also need the android build to cover those solutions.

## Installing Node.js

### Homebrew (Recommended)
If you don't have homebrew, and you would like to install it on your mac, run the following command in terminal.

`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

Verify with `brew -v`

then just: `brew install node`

### Packager Install

Download and run the `Current` lastest Node version on https://nodejs.org/

## Prerequisites
* Familiarity with xCode
* Familiarity with App Store Connect
* Node.js and NPM installed, Yarn Optional.
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

run `

Open the `.xcworkspace` file in xCode

### xCode

#### Navigate to the project target,

Reassign the `Bundle Identifier` and `Display Name` to whatever you want. In the case of your `Bundle Identifier`, you should use reverse domain notation. eg: For Coop Dreams you could denote it: `app.getvoxi.coopdreams`. However, make sure to keep the `XCodeSchemesLowercase` variable to continue having access to all your app bundles at once on your phones.

Change the `Team` in the `Target > Signing Section`

#### Navigate to the Project's `info.plist`

Change the `Privacy - Location When in Use Description` and `Privacy - Microphone Usage Description` to reflect the App's name

#### Navigate to the Project's `Images.xcassets`

replace the AppIcon and splash_image resources with the matching images you prepared earlier

##### Take notice of the Alternate AppIcon.[Scheme name], If you append `${XCodeSchemesLowercase}` to `Build Settings > User-Defined > Asset Catalog Compiler > Asset Catalog App Icon Set Name`, you can fill in those new app icons to have different icons per build configuration.

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

#### Navigate to the project target > General

Each time you publish a new build to the app store, make sure to increment the build number or Apple will not allow the push.

#### Take Notice of XCode's Top Left Button Group

If this is the first time running the app, switch the scheme to `Release` and run it. React Native is weird with additional schemes and so `Staging` Actually relies on the same files as `Release` (configuration variables still stay the same though, and don't cause issues :P)

Switch the scheme to `Staging` to get ready to test it live on `https://demo.getvoxi.app` or whatever you set in the `Build Settings > User-Defined > WebRTCAdapterSettingURL > Staging`

##### This new third scheme allows you and your team to change the `Debug` url all you want to fit local development environments

#### Next Steps

Once tested on a physical device with the `Release` Scheme, and you are sure you'd like to publish, switch the build target to `Generic iOS Device`

Publish to the app store from `Product > Archive`
##### Make sure to not archive the `Staging` Scheme

Wait for the archive to finish and upload to App Store Connect

## Extending JS
Edit: I discovered that I am unable to do this easily. For now just make sure to have `node` and `npm`, `yarn` is the package manager I use. I will continue exploring my options here out of my own curiosity, but there doesnt seem to be much documentation on that part of React Native.
<!-- I moved the project configuration from compiled typescript to xCode in order to eliminate the npm / yarn dependency and eliminate the need to compile any JS code. If you would like to extend this and change the compiled main.jsbundle, you will need to run `npm i` or `yarn` in the project directory to download all node_modules

Utilizing the CustomOfflineComponent requires this option. -->

## Building for Android
iOS inherently blocks WebViews from exposing WebRTC Camera and Microphone, however, android doesn't have this same problem, so this same project will run the same on android, but use the PWA's normal WebRTC api to get Mic information.

The issue with building for android is that I haven't linked the RCT Bridged Modules to the android build. Once that is done, it will run just as good on android devices with this same repo.
