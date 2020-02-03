![](https://github.com/Haschtl/ModernWebsocketClient/blob/master/public/assets/icon/favicon.png)

# OpenSource Websocket Client v1.0

## Description

- This is an **OpenSource** project - so everyone is welcome to make further improvements (issues, feature requests, pull requests, ...).
- This is a simple WebsocketClient-Application with Input-Completition and some small nice features. You can use SecureWebsockets (SSL) or normal Websockets.
- Currently, you can only connect to one server at a time.

## Installation

- Download the latest version for your system in the [Release-Section](https://github.com/Haschtl/ModernWebsocketClient/releases)
- Soon there will be an Android-App in the [PlayStore](http://play.google.com/store/search?q=Modern+Websocket+Client&c=apps)
- This app is also hosted on firebase: [WebsocketClient WebApp](https://modern-websocket-client.web.app)

## Setup this project

**Prerequirements**: You need to have Ionic 4 installed

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
