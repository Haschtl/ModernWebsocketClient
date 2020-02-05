import * as connections from './actions';
import { Connection, ConnectionState } from './types';
import { ActionType, getType } from 'typesafe-actions';
import { Middleware } from 'redux';
import * as cogoToast from '../../components/CustomToasts';
import i18n from '../../i18n';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

const { Storage, Filesystem } = Plugins;
var crypto = require('crypto');


export const fetchConnectionsMiddleware: Middleware<{}, ConnectionState> = ({ getState }) => next => async (action: ActionType<typeof connections>) => {
  next(action);

  if (action.type === getType(connections.importConnections)) {
    const path = 'External/RTOC_config.json'
    try {
      const data = await Filesystem.readFile({
        path: 'RTOC_config.json',
        directory: FilesystemDirectory.ExternalStorage,
        encoding: FilesystemEncoding.UTF8
      });
      next(connections.fetchConnections.success(JSON.parse(data.data)))
      cogoToast.success(i18n.t('Config-file has been imported from ') + path)
    } catch (e) {
      console.error('Unable to read file', e);
      cogoToast.error(i18n.t('Unable to read config-file. Make sure the file is in ') + path)
    }
  }
  if (action.type === getType(connections.saveConnections)) {
    try {
      console.log('Saving connections to storage')
      for (var i = 0; i < action.payload.length; i++) {
        if (action.meta !== undefined) {
          if (action.payload[i].id === action.meta.id) {
            action.payload[i] = action.meta
          }
        }
        // action.payload[i].connected = false
      }

      await Storage.set({ key: "websockets", value: JSON.stringify(action.payload) })
    } catch (e) {
      console.error(e)
      next(connections.fetchConnections.failure(e));
    }
  }


  else if (action.type === getType(connections.loadConnections)) {
    next(connections.fetchConnections.request());
    try {
      const responseStorage = await Storage.get({ key: "websockets" })
      if (responseStorage.value === null) {
        console.warn("Connections-value is empty. Cannot be saved to storage")
      }
      else {
        var a = await JSON.parse(responseStorage.value);
        var connectionList: Connection[] = a;
        for (i = 0; i < connectionList.length; i++) {
          connectionList[i].connected = false
          if (connectionList[i].commands === undefined) {
            connectionList[i].commands = []
          }
          if (connectionList[i].messages === undefined) {
            connectionList[i].messages = []
          }
          if (connectionList[i].password === undefined) {
            connectionList[i].password = ''
          }
        }
        next(connections.fetchConnections.success(connectionList));
      }

    } catch (e) {
      console.error(e)
    }
  }

  else if (action.type === getType(connections.setTheme)) {
    try {
      console.log('Saving theme to storage')

      await Storage.set({ key: "theme", value: JSON.stringify(action.payload) })
    } catch (e) {
      console.error(e)
      next(connections.fetchConnections.failure(e));
    }
  }

  else if (action.type === getType(connections.loadTheme)) {
    next(connections.fetchConnections.request());
    try {
      console.log('Loading theme from storage')
      const responseStorage = await Storage.get({ key: "theme" })
      if (responseStorage.value === null) {
        console.warn("darkMode-value is empty. Cannot be loaded from storage")
      }
      else {
        const b = await JSON.parse(responseStorage.value);
        next(connections.setTheme(b));
        // }
      }

    } catch (e) {
      console.error(e)
    }
  }

  else if (action.type === getType(connections.updateConnections)) {
    next(connections.fetchConnections.request());
    try {
      console.log('Loading connections from file')
      const response = await fetch('/assets/data/connections.json');
      const connectionList: Connection[] = await response.json();
      next(connections.fetchConnections.success(connectionList));
    } catch (e) {
      console.error(e)
      next(connections.fetchConnections.failure(e));
    }
  }


  else if (action.type === getType(connections.quitConnection)) {
    next(connections.websocketConnection.request(action.payload));
    console.log('Closing websocket connection with ' + action.payload.name)
    // next(connections.createWebsocket(action.payload, undefined));
    // }
    next(connections.websocketClosed(action.payload));
  }


  else if (action.type === getType(connections.establishConnection)) {
    next(connections.websocketConnection.request(action.payload));
    console.log('Establishing websocket connection with ' + action.payload.name)
    var encrypted = 'ws://'
    if (action.payload.ssl) {
      encrypted = 'wss://'
    }
    // var options = {rejectUnauthorized: false};
    var url = encrypted + action.payload.host + ':' + action.payload.port;
    var ws = new WebSocket(url);
    // websocket onopen event listener
    ws.onopen = () => {
      console.log("connected websocket main component");
      next(connections.createWebsocket(action.payload, ws));
      next(connections.websocketConnection.success(action.payload));
      // hash = crypto.createHash("sha256").update(action.payload.password, 'utf8').digest('base64')
      var hash = ''
      if (action.payload.password !== "") {
        hash = crypto.createHash("sha256").update(action.payload.password, 'utf8').digest('base64')
        next(connections.sendWebsocket(action.payload, JSON.stringify({ 'authorize': hash })));
      }
    };

    // websocket onclose event listener
    ws.onclose = (e: any) => {
      console.warn(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (action.payload.timeout + action.payload.timeout) / 1000
        )} second.`,
        e.reason
      );
      cogoToast.warn(i18n.t('Connection with ') + action.payload.name + i18n.t(' closed.'))
      next(connections.websocketConnection.failure(action.payload));

    };

    ws.onmessage = (evt: any) => {
      next(connections.newDataIncoming(action.payload, evt.data));
    }

    // websocket onerror event listener
    ws.onerror = (err: any) => {
      console.error(
        "Socket encountered error: ",
        err,
        "Closing socket"
      );
      cogoToast.error(i18n.t('Connection with ') + action.payload.name + i18n.t(' failed.'))
      next(connections.websocketConnection.failure(action.payload));
      ws.close();
    };
  }
  else {
    return
  }
};