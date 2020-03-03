ECHO building release-app with ionic
ionic build --release

ECHO Copy files to android-studio with capacitor
ionic capacitor copy android


ECHO Copy files to electron with capacitor
npx cap copy

firebase deploy

cd electron
SET /P _inputname= Please edit /electron/app/index.html from <base href=\"/\"> to <base href=\"./\">
ECHO Build executables for platforms with electron
electron-packager . "WebSocketClient" --all --overwrite

ECHO Now open Android studio and create a signed apk, which can be uploaded to the PlayStore
ECHO And run it as a server with 'cd build && serve -p 8050