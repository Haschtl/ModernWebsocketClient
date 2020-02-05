ionic build --release
ionic capacitor copy android
npx cap copy
firebase deploy
cd electron
SET /P _inputname= Please edit /electron/app/index.html from <base href=\"/\"> to <base href=\"./\">
electron-packager . "WebSocketClient" --all --overwrite