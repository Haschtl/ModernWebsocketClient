zip -r export/WebsocketClient1.X-nodejs.zip build/
zip -r export/WebsocketClient1.X-source.zip public/ src/
cd electron
zip -r ../export/WebSocketClient1.X-darwin-x64.zip WebSocketClient-darwin-x64/
tar -zcvf ../export/WebSocketClient1.X-linux-arm64.tar.gz WebsocketClient-linux-arm64/
tar -zcvf ../export/WebsocketClient1.X-linux-armv7l.tar.gz WebsocketClient-linux-armv7l/
tar -zcvf ../export/WebsocketClient1.X-linux-ia32.tar.gz WebsocketClient-linux-ia32/
tar -zcvf ../export/WebsocketClient1.X-linux-x64.tar.gz WebsocketClient-linux-x64/
zip -r ../export/WebSocketClient1.X-mas-x64.zip WebsocketClient-mas-x64/
zip -r ../export/WebsocketClient1.X-win32-arm64.zip WebsocketClient-win32-arm64/
zip -r ../export/WebsocketClient1.X-win32-ia32.zip WebsocketClient-win32-ia32/
zip -r ../export/WebSocketClient1.X-win32-x64.zip WebsocketClient-win32-x64/
cd ..
mv android/app/build/outputs/apk/debug/app-debug.apk export/WebsocketClient1.X-android.apk
