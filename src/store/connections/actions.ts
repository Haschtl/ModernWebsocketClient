import { createAction, createAsyncAction } from 'typesafe-actions';
import { Connection, Command, Theme, Tutorial } from './types';

export const fetchConnections = createAsyncAction(
  'connect/FETCH_REQUEST',
  'connect/FETCH_SUCCESS',
  'connect/FETCH_FAILURE'
)<void, Connection[], string>();

export const updateConnections = createAction('connect/UPDATE_CONNECTIONS', resolve =>
  () => resolve()
);

export const saveConnections = createAction('connect/SAVE_CONNECTIONS', resolve =>
  (connections: Connection[], active?: Connection) => resolve(connections, active)
);

export const editConnection = createAction('connect/EDIT_CONNECTION', resolve =>
  (connection: Connection) => resolve(connection)
);

export const removeCommand = createAction('connect/REMOVE_COMMAND', resolve =>
  (connection: Connection, command: Command) => resolve(connection, command)
);

export const loadConnections = createAction('connect/LOAD_CONNECTIONS', resolve =>
  () => resolve()
);

export const addConnection = createAction('connect/ADD_CONNECTION', resolve =>
  (connection: Connection) => resolve(connection)
);

export const establishConnection = createAction('connect/ESTABLISH_CONNECTION', resolve =>
  (host: Connection) => resolve(host)
);

export const removeConnection = createAction('connect/REMOVE_CONNECTION', resolve =>
  (host: Connection) => resolve(host)
);

export const quitConnection = createAction('connect/QUIT_CONNECTION', resolve =>
  (host: Connection) => resolve(host)
);

export const createWebsocket = createAction('connect/CREATE_WEBSOCKET', resolve =>
  (con: Connection, host: WebSocket) => resolve(con, host)
);

export const setActiveConnection = createAction('connect/SET_ACTIVE_CONNECTION', resolve =>
  (host: Connection) => resolve(host)
);

export const websocketClosed = createAction('connect/WS_CLOSED', resolve =>
  (host: Connection) => resolve(host)
);

export const websocketConnection = createAsyncAction(
  'connect/WS_REQUEST',
  'connect/WS_SUCCESS',
  'connect/WS_FAILURE',
)<Connection, Connection, Connection>();

export const newDataIncoming = createAction('connect/NEW_DATA_INCOMING', resolve =>
  (con: Connection, data: string) => resolve(con, data)
);

export const sendWebsocket = createAction('connect/SEND_WEBSOCKET', resolve =>
  (con: Connection, data: string) => resolve(con, data)
);

export const clearMessages = createAction('connect/CLEAR_MESSAGES', resolve =>
  (con: Connection) => resolve(con)
);

export const setState2 = createAction('connect/SET_STATE2', resolve =>
  (data: Object) => resolve(data)
);

export const clearReducerHistory = createAction('connect/CLEAR_REDUCER_HISTORY', resolve =>
  () => resolve()
);

export const setTheme = createAction('connect/SET_THEME', resolve =>
  (data: Theme) => resolve(data)
);

export const setTutorials = createAction('connect/SET_TUTORIALS', resolve =>
  (data: Tutorial[]) => resolve(data)
);

export const loadTheme = createAction('connect/LOAD_THEME', resolve =>
  () => resolve()
);

export const importConnections = createAction('connect/IMPORT_CONNECTIONS', resolve =>
  () => resolve()
);

export const log = createAction('connect/LOG', resolve =>
  (log: string) => resolve(log)
);

export const setChatInput = createAction('connect/SET_CHAT_INPUT', resolve =>
  (con: Connection, text: string | undefined) => resolve(con, text)
);