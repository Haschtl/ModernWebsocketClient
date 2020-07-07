![](https://github.com/Haschtl/ModernWebsocketClient/blob/master/public/assets/icon/favicon.png)

# OpenSource Websocket Client v1.6
[Homepage](https://haschtl.github.io/ModernWebsocketClient/)

[WebApp](https://modern-websocket-client.web.app)

## Description

- This is an **OpenSource** project - so everyone is welcome to make further improvements (issues, feature requests, pull requests, ...).
- This is a simple WebsocketClient-Application with Input-Completition and some small nice features. You can use SecureWebsockets (SSL) or normal Websockets.
- Connect to multiple servers at the same time.
- Save messages and Auto-Complete
- Modern Chat-like design
- Multiple themes
- All platforms supported
- Nice JSON-Data formatting
- Binary message supported
- Basic Authentification supported
- Sec-WebSocket-Protocol supported
- Custom AES-Ecryption
- Message Presets - Available: [Crescience](https://cre.science) and [RTOC](https://haschtl.github.io/RealTimeOpenControl/)

## Example Ionic5 React project
This app can be seen as an Ionic5 React example, that can be deployed on all available platforms with the following features:
- Automatic language detection (with custom translation files)
- Using storage
- Using Websocket connections
- Custom-AES-Encryption

I provide platform-specific instructions in this readme below.

## Installation

- Download the latest version for your system in the [Release-Section](https://github.com/Haschtl/ModernWebsocketClient/releases)
- Soon there will be an Android-App in the [PlayStore](http://play.google.com/store/search?q=Modern+Websocket+Client&c=apps)
- This app is also hosted on firebase: [WebsocketClient WebApp](https://modern-websocket-client.web.app)

## Setup this project

**Prerequirements**: You need to have Ionic 5 installed

If you want build this Websocket Client by your own, you need to follow these steps:

1. Clone this repository and go to it's directory
2. Execute `npm install` to install the dependencies
3. Run local server with `ionic serve`



## Build 
To build this App for any system you need to build it with ionic first

'ionic build --release'

The output will be in the "build" folder.





### Build for the Web
The build-process for the web is already finished. You just need the "build" folder.

Go into the "build" folder and execute `serve -p 8050` to run the App at port 8050.






### Build for Android
**Prerequirements**: You need to have Android Studio installed

You need to add Android with capacitor only once:

`ionic capacitor add android`

Then you can copy the build to AndroidStudio

`ionic capacitor copy android`

After this you need to open Android Studio and build the apk

`npx cap open android`

You may want to edit the /App/stc/main/AndroidManifest.xml and add these two lines
```
android:usesCleartextTraffic="true"
android:hardwareAccelerated="true"
```
in the 'application' tag

And also you dont want to have an Ionic Icon and Ionic Loading screen?
Then replace all 'splash.png' in the 'android\app\src\main\res\drawable*' folders
and all icons in the 'android\app\src\main\res\mipmap*' folder. 
**Annoying**  -> Good that we have tools like [this](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.type=clipart&foreground.clipart=android&foreground.space.trim=1&foreground.space.pad=0.25&foreColor=rgba(96%2C%20125%2C%20139%2C%200)&backColor=rgb(68%2C%20138%2C%20255)&crop=0&backgroundShape=square&effects=none&name=ic_launcher) and [that](https://romannurik.github.io/AndroidAssetStudio/nine-patches.html#&sourceDensity=320&name=example)



### Build for Windows, Linux, Mac with electron
**Prerequirements**: You need electron installed

You need to add Electron with capacitor only once :

`ionic capacitor add electron`
Then edit the 'index.js' file in the "electron" folder
```
let useSplashScreen = false;
```
Then edit the'package.json' file in your root-directory:
`"homepage": ".",`
This is [somehow needed](https://github.com/ionic-team/capacitor/issues/639) 
Copy your build to electron: `npx cap copy`

**Important: Change <base href="/"/> -> <base href="./"/> in electron/app/index.html**

Go to the Electron directory `cd electron` and test, if electron works `npm run electron:start`.

Then you can build it for all systems:

```
electron-packager . --platform=win32 --overwrite
electron-packager . --platform=darwin --overwrite
electron-packager . "WebSocketClient" --all --overwrite
```
Exeutables will be in electron/capacitor-app-*/




### Upload to firebase
**Prerequirements**: You need a firebase-account and firebase installed and configured

Initialize firebase for this App once: `firebase init` and follow the guide.

Then you can upload you build with
`firebase deploy`







### Extra: Build electron-windows-app (not working)
electron-windows-store `
    --input-directory PATHTOAPP\electron `
    --output-directory PATHTOAPP\WindowsStore `
    --package-version 1.0.0.0 `
    --package-name WebsocketClient


## Custom AES Encryption
The custom encryption consists of two parts:
1. Encryption of every message with AES and first 16-chars of SHA256-Hash of provided password
AES is used with IV=16random byte. These random bytes are append to the encrypted message.
2. Additionally, the client sends a json to the server to get authentification (handshake): `{authorize: FULL_SHA256_HASH}`


## Example systemd-service
```
# /etc/systemd/system/WebsocketClient.service

[Unit]
Description=RTOC Remote
After=network.target

[Service]
Type=simple
User=kelleroot
Group=kelleroot
WorkingDirectory=/home/**USER**/ModernWebsocketClient/
ExecStart=/snap/bin/serve -p 8888 /home/**USER**/ModernWebsocketClient/build
SyslogIdentifier=RTOCRemote
StandardOutput=syslog
StandardError=syslog
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```
After creating the file, you need to call `sudo systemctl daemon-reload`.

Then you can start the service with `sudo systemctl start WebsocketClient`.

To run it after boot: `sudo systemctl enable WebsocketClient`.

To get the log of the service: `sudo journalctl -u WebsocketClient`.

## Example Apache2-Configuration (with SSL)
```
<VirtualHost *:80>
    ServerName MYSERVERADRESS
    ServerAdmin admin@server.com

    ProxyPreserveHost On

    Redirect 301 / https://MYSERVERADRESS
</VirtualHost>


<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName MYSERVERADRESS
    ServerAdmin admin@server.com

    ProxyPreserveHost On
    ProxyRequests Off

    <Location />
       ProxyPass http://localhost:8888/
       ProxyPassReverse http://localhost:8888/

       RewriteEngine on
       RewriteCond %{HTTP:UPGRADE} ^WebSocket$ [NC]
       RewriteCond %{HTTP:CONNECTION} Upgrade$ [NC]
       RewriteRule .* ws://localhost:8888%{REQUEST_URI} [P]
    </Location>
</VirtualHost>
</IfModule>
```
Don't forget to enable the apache-config with `sudo a2ensite PAGENAME`

To add SSL-Encryption, just call `sudo certbot -d MYSERVERADRESS`
