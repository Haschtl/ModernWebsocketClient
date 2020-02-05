import * as connections from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { ConnectionState, Connection, Message, Command } from './types';
import * as crypto from '../encryption'


export const connectionDefaultState: ConnectionState = {
  connections: [],
  theme: 'dark-theme',
  tutorials: [],
  version: '1.1',
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
      return state;
    case getType(connections.removeConnection):
      con = state.connections.find(e => e.id === action.payload.id);
      if (con === undefined) {
        console.error('Failed')
        return state;
      }
      state.connections.splice(state.connections.indexOf(con), 1)
      return state;
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
      Msg = {member: {id: -2}, date:date, text: "Connected"} as Message;
      newCon[state.connections.indexOf(action.payload)].messages = [...action.payload.messages, Msg]
      return {
        ...state,
        connections: newCon,
      }
    case getType(connections.websocketConnection.failure):
      console.error('Websocket-server failure')
      console.error(action.payload)
      curCon = action.payload
      if (con === undefined) {
        console.error('Failed')
        return state;
      }
      action.payload.connected = false
      newCon = state.connections
      newCon[state.connections.indexOf(con)] = action.payload
      date = Date.now()
      Msg = {member: {id: -2}, date:date, text: "Failure"} as Message;
      newCon[state.connections.indexOf(curCon)].messages = [...curCon.messages, Msg]
      return {
        ...state,
        connections: newCon,
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
      newCon[state.connections.indexOf(curCon)].connected = false
      newCon[state.connections.indexOf(curCon)].ws = undefined
      date = Date.now()
      Msg = {member: {id: -2}, date:date, text: "Disconnected"} as Message;
      newCon[state.connections.indexOf(curCon)].messages = [...curCon.messages, Msg]
      return {
        ...state,
        connections: newCon,
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
        connections: newCon,
      }
    case getType(connections.newDataIncoming):
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      newCon = state.connections
      const recv: any = action.meta
      date = Date.now()
      Msg = {member: {id: curCon.id, name: curCon.name}, date:date, text: recv} as Message;
      newCon[state.connections.indexOf(curCon)].messages = [...curCon.messages, Msg]
        return {
          ...state,
          connections: newCon,
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
        connections: newCon,
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
        connections: newCon,
      }
    case getType(connections.sendWebsocket):
      if(action.meta === '') {return state}
      curCon = action.payload
      if (curCon === undefined) {
        console.error('Failed')
        return state;
      }
      newCon = state.connections
      if (curCon.ws !== undefined) {
        try {
          var message = action.meta;
          if (curCon.password !== "") {
            message = crypto.encryptStr(action.meta, curCon.password)
          }
          curCon.ws.send(message)
          const date = Date.now()
          const Msg = {member: {id: -1, name: 'Me'}, date: date, text: message} as Message;
          
          var found=false;
          for(var c in curCon.commands){
            if(curCon.commands[c].value === message){
              found=true;
              curCon.commands[c].num += 1
            }
          }
          if(found===false){
            curCon.commands =  [...curCon.commands ,{value: message, num: 1} as Command]
          }
          console.log(curCon.commands)
          curCon.messages = [...curCon.messages, Msg]
          newCon[newCon.indexOf(action.payload)]=curCon
          return {
            ...state,
            connections: newCon,
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
