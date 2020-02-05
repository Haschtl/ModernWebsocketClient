import * as connections from './actions';
import { Connection, ConnectionState, Command } from './types';
import { ActionType, getType } from 'typesafe-actions';
import { Middleware } from 'redux';
import * as cogoToast from '../../components/CustomToasts';
import i18n from '../../i18n';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
// import YAML from 'yaml'
const { Storage, Filesystem } = Plugins;
var yaml = require('js-yaml');
var crypto = require('crypto');


export const fetchConnectionsMiddleware: Middleware<{}, ConnectionState> = ({ getState }) => next => async (action: ActionType<typeof connections>) => {
  next(action);

  if (action.type === getType(connections.importConnections)) {
    const path = 'External/ModernWebsocketClientConfig.json'
    try {
      const data = await Filesystem.readFile({
        path: 'ModernWebsocketClientConfig.json',
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
          if (connectionList[i].beautify === undefined) {
            connectionList[i].beautify = true
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

  else if (action.type === getType(connections.loadProtocolPresets)) {
    next(connections.fetchConnections.request());
    var r1: Command[] = []
    var r2: Command[] = []
    var r3: Command[] = []

    try {
      console.log('Loading protocol presets from different files')
      try{
      const response1 = await fetch('/assets/protocols/RTOC.json');
      const res1: string[] = await response1.json();
      r1 = res1.map((value:string, idx:number)=>{
        return {value:value, num:0} as Command
      })
      }
      catch{console.error('Cannot read /assets/protocols/RTOC.json')}

      try{
      const response2 = await fetch('/assets/protocols/CresRoot.json');
      const res2: string[] = await response2.json();
      r2 = res2.map((value:string, idx:number)=>{
        return {value:value, num:0} as Command
      })}
      catch{console.error('Cannot read /assets/protocols/CresRoot.json')}
      
      try{
      const response3 = await fetch('/assets/protocols/CresDeneb.yml');
      var res3: string = await response3.text()
      // const r3 = YAML.parseCST(res3).
      // var res3split = res3.split('\n')
      // for(var i=1;i>res3split.length;i++){
      //   if(res3split[i].indexOf(':')===-1){
      //     res3split[i].split(')').join('')
      //   }
      // }
      // res3 = res3split.join('\n')
      var obj = yaml.load(res3);
      // console.log(obj)
      r3 = recursiveYaml(obj).map((value:string, idx:number)=>{
        return {value:value, num:0} as Command
      })
      // console.log(r3)
      // this code if you want to save
      // fs.writeFileSync(outputfile, JSON.stringify(obj, null, 2));
      }catch (e){console.error(e); console.error('Cannot read /assets/protocols/CresDeneb.yml')}
      
      const deneb = ['Crescience Deneb', [...r2,...r3]] as [string, Command[]]
      const rtoc = ['RTOC', [...r1]] as [string, Command[]]
      next(connections.fetchProtocols.success([deneb, rtoc]));
    
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
      next(connections.websocketConnection.failure([action.payload, e]));
    };

    ws.onmessage = (evt: any) => {
      next(connections.newDataIncoming(action.payload, evt.data));
    }

    // websocket onerror event listener
    ws.onerror = (e: any) => {
      next(connections.websocketConnection.failure([action.payload, e]));
      ws.close();
    };
  }
  else {
    return
  }
};

function recursiveYaml(obj:Object, initialPath:string='') {
  var r: string[] = []
  var updatedPath: string = initialPath;
  for(var [key, value] of Object.entries(obj)){
    // console.log(key)
    // console.log(value)
    if(initialPath.length===0){
      updatedPath = initialPath+key
    }
    else{
      updatedPath = initialPath+':'+key
    }

    if(typeof value === 'object' && value !== null && value !== undefined ) {
      var subr = recursiveYaml(value, updatedPath)
      r = [...subr,...r]
    }
    else{
      // return([initialPath+':'+value])
      if(typeof value === 'string'){
        if(value.indexOf('(')===-1){
          r.push(updatedPath+' = '+value)
        }
        else{
          r.push(updatedPath+value)
        }
      }
      else{
        r.push(updatedPath+' = '+value)
      }
    }
  }
  // console.log(r)
  return r
}