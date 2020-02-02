import * as connections from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { ConnectionState, Connection, Message, Command } from './types';


export const connectionDefaultState: ConnectionState = {
  connections: [],
  waiting: false,
  maxN: 1000,
  zoomArgument: true,
  panArgument: true,
  zoomValue: false,
  panValue: false,
  messages: [],
  userActions: [],
  theme: 'dark-theme',
  tutorials: [],
  version: '1.0',
  log: []
}

export default (state = connectionDefaultState, action: ActionType<typeof connections>): ConnectionState => {
  var con: Connection | undefined;
  var newCon: Connection[];
  var newId: number;
  switch (action.type) {

    case getType(connections.clearLog):
      return {
        ...state,
        log: []
      }

    case getType(connections.log):
      var oldList = state.log
      oldList.push(action.payload)
      if (oldList.length > 10) {
        oldList.splice(0,1)
        }
      return {
        ...state,
        log: oldList 
      }

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
      con = state.connections.find(e => e.id === action.payload);
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
      con = action.payload;
      if (con === undefined) {
        console.error('Failed')
        return {
          ...state,
          active: undefined
        }
      }
      action.payload.connected = true
      newCon = state.connections
      newCon[state.connections.indexOf(con)] = action.payload
      return {
        ...state,
        connections: newCon,
        active: con,
        history: '/chat',
      }
    case getType(connections.websocketConnection.failure):
      console.error('Websocket-server failure')
      console.error(action.payload)
      con = action.payload
      if (con === undefined) {
        console.error('Failed')
        return state;
      }
      action.payload.connected = false
      newCon = state.connections
      newCon[state.connections.indexOf(con)] = action.payload
      return {
        ...state,
        connections: newCon,
        active: undefined,
        history: '/connect',
        config: undefined,
        userActions: []
      }
    case getType(connections.setState2):
      return {
        ...state,
        ...action.payload
      }
    case getType(connections.deleteActionPicture):
      return {
        ...state,
        actionPicture: undefined
      }
    case getType(connections.websocketClosed):
      console.log('Websocket-server closed')
      if (state.ws !== undefined) {
        state.ws.close()
      }
      var oldActive = state.active
      if (oldActive === undefined) {
        console.error('Failed')
        return state;
      }
      newCon = state.connections
      newCon[state.connections.indexOf(oldActive)].connected = false
      return {
        ...state,
        connections: newCon,
        active: undefined,
        ws: undefined
      }

    case getType(connections.clearMessages):
      return {
        ...state,
        messages: []
      }
    case getType(connections.newDataIncoming):
      if (state.active === undefined) {
        console.error('Cannot receive message. No active connection')
        return { ...state }
      }
        const recv: any = action.payload
        var active = state.active
        const date = Date.now()
        const Msg = {member: active, date:date, text: recv} as Message;
        return {
          ...state,
          messages: [...state.messages, Msg]
        }

    case getType(connections.createWebsocket):
      if (action.payload === undefined && state.ws !== undefined) {
        state.ws.close()
      }
      return {
        ...state,
        ws: action.payload
      }

    case getType(connections.clearReducerHistory):
      return {
        ...state,
        history: undefined
      }

    case getType(connections.stopWaiting):
      return {
        ...state,
        waiting: false
      }

    case getType(connections.setActiveConnection):
      return {
        ...state,
        active: action.payload
      }
    case getType(connections.setChatInput):
      return {
        ...state,
        chatInput: action.payload
      }
    case getType(connections.sendWebsocket):
      if (state.active === undefined) {
        console.error('Cant send message to host. No active connection')
        return {
          ...state
        }
      }
      if(action.payload === '') {return state}
      if (state.ws !== undefined) {
        try {
          var message = action.payload;
          state.ws.send(message)
          var active2 = state.active
          const date = Date.now()
          const Msg = {member: {id: -1, name: 'Me'}, date: date, text: message} as Message;
          
          var found=false;
          for(var c in active2.commands){
            if(active2.commands[c].value === message){
              found=true;
              active2.commands[c].num += 1
            }
          }
          if(found===false){
            active2.commands =  [...active2.commands ,{value: message, num: 1} as Command]
          }
          console.log(active2.commands)
          return {
            ...state,
            waiting: true,
            messages: [...state.messages, Msg],
            active:active2
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
