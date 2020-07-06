import { createCustomAction, createAsyncAction } from 'typesafe-actions';
import { Connection, Command, Theme, Tutorial } from './types';

export const fetchConnections = createAsyncAction(
  'connect/FETCH_REQUEST',
  'connect/FETCH_SUCCESS',
  'connect/FETCH_FAILURE'
)<void, Connection[], string>();

export const fetchProtocols = createAsyncAction(
  'connect/FETCH_PRO_REQUEST',
  'connect/FETCH_PRO_SUCCESS',
  'connect/FETCH_PRO_FAILURE'
)<void, [string, Command[]][], string>();

export const saveConnections = createCustomAction('connect/SAVE_CONNECTIONS',
  (connections: Connection[], active?: Connection) => ({ payload: connections, meta: active })
);

export const editConnection = createCustomAction('connect/EDIT_CONNECTION',
  (connection: Connection) => ({ payload: connection })
);

export const loadProtocolPresets = createCustomAction('connect/LOAD_PROTOCOL_PRESETS',
  () => ({})
);

export const removeCommand = createCustomAction('connect/REMOVE_COMMAND',
  (connection: Connection, command: Command) => ({ payload: connection, meta: command })
);

export const addCommandExecutes = createCustomAction('connect/ADD_COMMAND_EXECUTES',
  (connection: Connection, command: Command, num: number) => ({ payload: connection, meta: command, num:num })
);

export const setCommands = createCustomAction('connect/SET_COMMANDS',
  (connection: Connection, commands: Command[]) => ({ payload: connection, meta: commands })
);


export const loadConnections = createCustomAction('connect/LOAD_CONNECTIONS',
  () => ({})
);

export const addConnection = createCustomAction('connect/ADD_CONNECTION',
  (connection: Connection) => ({ payload: connection })
);

export const establishConnection = createCustomAction('connect/ESTABLISH_CONNECTION',
  (host: Connection) => ({ payload: host })
);

export const removeConnection = createCustomAction('connect/REMOVE_CONNECTION',
  (host: Connection) => ({ payload: host })
);

export const quitConnection = createCustomAction('connect/QUIT_CONNECTION',
  (host: Connection) => ({ payload: host })
);

export const createWebsocket = createCustomAction('connect/CREATE_WEBSOCKET',
  (con: Connection, host: WebSocket) => ({ payload: con, meta: host })
);

export const websocketClosed = createCustomAction('connect/WS_CLOSED',
  (host: Connection) => ({ payload: host })
);

export const websocketConnection = createAsyncAction(
  'connect/WS_REQUEST',
  'connect/WS_SUCCESS',
  'connect/WS_FAILURE',
)<Connection, Connection, {con:Connection, meta:any}>();

export const newDataIncoming = createCustomAction('connect/NEW_DATA_INCOMING',
  (con: Connection, data: any) => ({ payload: con, meta: data })
);

export const sendWebsocket = createCustomAction('connect/SEND_WEBSOCKET',
  (con: Connection, data: string) => ({ payload: con, meta: data })
);

export const clearMessages = createCustomAction('connect/CLEAR_MESSAGES',
  (con: Connection) => ({ payload: con })
);

export const setState2 = createCustomAction('connect/SET_STATE2',
  (data: Object) => ({ payload: data })
);
export const setCurrentChat = createCustomAction('connect/SET_CURRENT_CHAT',
  (data: number) => ({ payload: data })
);
export const clearReducerHistory = createCustomAction('connect/CLEAR_REDUCER_HISTORY',
  () => ({})
);

export const setTheme = createCustomAction('connect/SET_THEME',
  (data: Theme) => ({ payload: data })
);

export const setTutorials = createCustomAction('connect/SET_TUTORIALS',
  (data: Tutorial[]) => ({ payload: data })
);

export const loadTheme = createCustomAction('connect/LOAD_THEME',
  () => ({})
);

export const importConnections = createCustomAction('connect/IMPORT_CONNECTIONS',
  () => ({})
);

export const log = createCustomAction('connect/LOG',
  (log: string) => ({ payload: log })
);

export const setChatInput = createCustomAction('connect/SET_CHAT_INPUT',
  (con: Connection, text: string | undefined) => ({ payload: con, meta: text })
);