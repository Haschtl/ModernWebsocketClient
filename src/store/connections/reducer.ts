import * as connections from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { ConnectionState, Connection, Message, Command } from './types';
import * as crypto from '../encryption'
import * as cogoToast from '../../components/CustomToasts';
import i18n from '../../i18n';
import { read } from 'fs';
import { type } from 'os';


export const connectionDefaultState: ConnectionState = {
  connections: [],
  theme: 'dark-theme',
  tutorials: [],
  version: '1.5.2',
  protocolPresets: [],
}

export default (state = connectionDefaultState, action: ActionType<typeof connections>): ConnectionState => {
  var con: Connection | undefined;
  var newCon: Connection[];
  var newId: number;
  var curCon: Connection;
  var date: number;
  var Msg: Message;
  switch (action.type) {
    case getType(connections.fetchConnections.success):
      return {
        ...state,
        connections: action.payload
      }
    case getType(connections.fetchProtocols.success):
      return {
        ...state,
        protocolPresets: action.payload
      }
    case getType(connections.fetchConnections.failure):
      return {
        ...state,
        history: action.payload
      }

    case getType(connections.addConnection):
      newId = 0;
      const usedIds = state.connections.map(({ id }) => id);
      while (usedIds.indexOf(newId) !== -1) {
        newId = newId + 1
      }
      action.payload.id = newId

      state.connections.push(action.payload)
      return {
        ...state,
        connections: [...state.connections]
      };;
    case getType(connections.removeConnection):
      con = state.connections.find(e => e.id === action.payload.id);
      if (con === undefined) {
        console.error('Failed')
        return state;
      }
      state.connections.splice(state.connections.indexOf(con), 1)
      return {
        ...state,
        connections: [...state.connections]
      };
    case getType(connections.editConnection):
      con = state.connections.find(e => e.id === action.payload.id);
      if (con === undefined) {
        console.error('Failed')
        return state;
      }
      state.connections[state.connections.indexOf(con)] = action.payload
      return state;

    case getType(connections.websocketConnection.success):
      console.log('Websocket-server connected')
      action.payload.connected = true
      newCon = state.connections
      newCon[state.connections.indexOf(action.payload)] = action.payload
      date = Date.now()
      Msg = { member: { id: -2 }, date: date, text: i18n.t("Connected") } as Message;
      newCon[state.connections.indexOf(action.payload)].messages = [...action.payload.messages, Msg]
      return {
        ...state,
        connections: [...newCon],
      }
    case getType(connections.websocketConnection.failure):
      curCon = action.payload.con
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      const errorEvent = action.payload.meta
      date = Date.now()
      var text = ""
      if (errorEvent.type === 'error') {
        cogoToast.error(i18n.t('Connection with ') + curCon.name + i18n.t(' failed.') + ' ' + errorEvent.reason)
        Msg = { member: { id: -2 }, date: date, text: i18n.t('Failure') } as Message;
        curCon.messages = [...curCon.messages, Msg]
      }
      else if (errorEvent.type === 'close') {
        if (errorEvent.wasClean) {
          cogoToast.warn(i18n.t('Connection with ') + curCon.name + i18n.t(' closed.'))
          Msg = { member: { id: -2 }, date: date, text: i18n.t('Disconnected') } as Message;
          curCon.messages = [...curCon.messages, Msg]
        }
        else {
          cogoToast.info(i18n.t('Connection with ') + curCon.name + i18n.t(' closed.') + ' (' + errorEvent.code + ')')
          Msg = { member: { id: -2 }, date: date, text: i18n.t('Disconnected') + ' (' + errorEvent.code + ')' } as Message;
          curCon.messages = [...curCon.messages, Msg]
        }
      }
      else {
        text = i18n.t('Unhandled error ') + errorEvent.reason
        cogoToast.error(text)
        Msg = { member: { id: -2 }, date: date, text: text } as Message;
        curCon.messages = [...curCon.messages, Msg]
      }
      console.error(action.payload)
      newCon = state.connections
      curCon.connected = false
      newCon[state.connections.indexOf(curCon)] = curCon
      return {
        ...state,
        connections: [...newCon],
      }
    case getType(connections.setCurrentChat):
      return {
        ...state,
        currentChat: action.payload,
      }
    case getType(connections.setState2):
      return {
        ...state,
        ...action.payload
      }
    case getType(connections.websocketClosed):
      console.log('Websocket-server closed')
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      if (curCon.ws !== undefined) {
        curCon.ws.close()
      }
      newCon = state.connections
      curCon.connected = false
      curCon.ws = undefined
      newCon[state.connections.indexOf(curCon)] = curCon
      date = Date.now()
      // Msg = { member: { id: -2 }, date: date, text: "Disconnected" } as Message;
      // newCon[state.connections.indexOf(curCon)].messages = [...curCon.messages, Msg]
      return {
        ...state,
        connections: [...newCon],
      }

    case getType(connections.clearMessages):
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      newCon = state.connections
      newCon[state.connections.indexOf(curCon)].messages = []
      return {
        ...state,
        connections: [...newCon],
      }
    case getType(connections.newDataIncoming):
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }

      var recv: MessageEvent = action.meta
      var readable_text: string | DataView = ""
      var typ = "string"
      if (typeof (recv.data) == "string") {
        readable_text = recv.data
      }
      else {
        typ = "binary"
        console.log(recv.data)
        // const reader = new FileReader();
        // reader.readAsArrayBuffer(recv.data);
        // reader.onloadend = (event) => {
        //     // The contents of the BLOB are in reader.result:
        //     console.log(reader.result);
        // }
        var dv = new DataView(recv.data);
        var bin: any;
        // console.log(curCon)
        switch (curCon.binaryType) {
          case "int8":
            bin = new Int8Array(dv.buffer)
            readable_text = dv.getInt8(curCon.binaryOffset) + ""
            break;
          case "uint8":
            bin = new Uint8Array(dv.buffer)
            readable_text = dv.getUint8(curCon.binaryOffset) + ""
            break;
          case "int16":
            bin = new Int16Array(dv.buffer)
            readable_text = dv.getInt16(curCon.binaryOffset) + ""
            break;
          case "uint16":
            bin = new Uint16Array(dv.buffer)
            readable_text = dv.getUint16(curCon.binaryOffset) + ""
            break;
          case "int32":
            bin = new Int32Array(dv.buffer)
            readable_text = dv.getInt32(curCon.binaryOffset) + ""
            break;
          case "uint32":
            bin = new Uint32Array(dv.buffer)
            readable_text = dv.getUint32(curCon.binaryOffset) + ""
            break;
          case "bigint64":
            bin = new BigInt64Array(dv.buffer)
            readable_text = dv.getBigInt64(curCon.binaryOffset) + ""
            break;
          case "biguint64":
            bin = new BigUint64Array(dv.buffer)
            readable_text = dv.getBigUint64(curCon.binaryOffset) + ""
            break;
          case "float32":
            bin = new Float32Array(dv.buffer)
            readable_text = dv.getFloat32(curCon.binaryOffset) + ""
            break;
          case "float64":
            bin = new Float64Array(dv.buffer)
            readable_text = dv.getFloat64(curCon.binaryOffset) + ""
            break;
          default:
            bin = "Cannot receive Binary-data. No binary-type configured. Please select one in the Connection-Settings"
            break;
        }
        readable_text = bin+""
        // console.log(String.fromCharCode.apply(null,bin))
        // console.log(bin+"")
      }
      if (action.payload.password !== '') {
        const message = crypto.decryptStr(action.meta.data, action.payload.password)
        if (message !== undefined && message !== false) {
          // action.meta.data = message
          readable_text = message
        }
      }
      // recv = action.meta
      newCon = state.connections
      date = Date.now()
      Msg = { member: { id: curCon.id, name: curCon.name }, date: date, typ: typ, text: readable_text } as Message;
      newCon[state.connections.indexOf(curCon)].messages.push(Msg)
      if (newCon[state.connections.indexOf(curCon)].messages.length >= 100) {
        newCon[state.connections.indexOf(curCon)].messages.slice(newCon[state.connections.indexOf(curCon)].messages.length - 80, newCon[state.connections.indexOf(curCon)].messages.length)
      }
      // if(curCon.id!==state.currentChat){
      //   cogoToast.info(i18n.t('Message from ') + curCon.name+':'+recv)
      // }
      return {
        ...state,
        connections: [...newCon],
      }

    case getType(connections.setCommands):
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      newCon = state.connections
      // if (curCon.ws !== undefined) {
      //   curCon.ws.close()
      // }
      curCon.commands = action.meta
      newCon[state.connections.indexOf(curCon)] = curCon
      return {
        ...state,
        connections: [...newCon],
      }
    case getType(connections.addCommandExecutes):
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      newCon = state.connections
      // if (curCon.ws !== undefined) {
      //   curCon.ws.close()
      // }
      curCon.commands[curCon.commands.indexOf(action.meta)].num += action.num
      newCon[state.connections.indexOf(curCon)] = curCon
      return {
        ...state,
        connections: [...newCon],
      }
    case getType(connections.removeCommand):
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      newCon = state.connections
      // if (curCon.ws !== undefined) {
      //   curCon.ws.close()
      // }
      curCon.commands.splice(curCon.commands.indexOf(action.meta), 1)
      newCon[state.connections.indexOf(curCon)] = curCon
      return {
        ...state,
        connections: [...newCon],
      }

    case getType(connections.createWebsocket):
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      newCon = state.connections
      // if (curCon.ws !== undefined) {
      //   curCon.ws.close()
      // }
      newCon[state.connections.indexOf(curCon)].ws = action.meta
      return {
        ...state,
        connections: [...newCon],
      }

    case getType(connections.clearReducerHistory):
      return {
        ...state,
        history: undefined
      }

    case getType(connections.setChatInput):
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      newCon = state.connections
      newCon[state.connections.indexOf(curCon)].chatInput = action.meta
      return {
        ...state,
        connections: [...newCon],
      }
    case getType(connections.sendWebsocket):
      if (action.meta === '') { return state }
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      newCon = state.connections
      if (curCon.ws !== undefined) {
        try {
          var message = action.meta;
          const date = Date.now()
          const Msg = { member: { id: -1, name: 'Me' }, date: date, text: message, typ: "string" } as Message;

          var found = false;
          for (var c in curCon.commands) {
            if (curCon.commands[c].value === message) {
              found = true;
              curCon.commands[c].num += 1
            }
          }
          if (found === false) {
            curCon.commands = [...curCon.commands, { value: message, num: 1 } as Command]
          }
          curCon.messages = [...curCon.messages, Msg]
          if (curCon.password !== "") {
            message = crypto.encryptStr(action.meta, curCon.password)
          }
          curCon.ws.send(message)
          newCon[newCon.indexOf(action.payload)] = curCon
          return {
            ...state,
            connections: [...newCon],
          }
        }
        catch{
          console.error('Error sending string: ' + action.payload)
        }
      }
      return {
        ...state,
      }

    case getType(connections.setTheme):
      return {
        ...state,
        theme: action.payload
      }
    case getType(connections.setTutorials):
      return {
        ...state,
        tutorials: action.payload
      }
    default:
      return state;
  }
}
