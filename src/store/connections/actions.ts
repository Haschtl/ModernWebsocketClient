import { createAction, createAsyncAction } from 'typesafe-actions';
import { Connection, Theme, Tutorial } from './types';

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
  (host: number) => resolve(host)
);

export const quitConnection = createAction('connect/QUIT_CONNECTION', resolve =>
  (host: Connection) => resolve(host)
);

export const createWebsocket = createAction('connect/CREATE_WEBSOCKET', resolve =>
  (host?: WebSocket) => resolve(host)
);

export const setActiveConnection = createAction('connect/SET_ACTIVE_CONNECTION', resolve =>
  (host: Connection) => resolve(host)
);

export const websocketClosed = createAction('connect/WS_CLOSED', resolve =>
  () => resolve()
);

export const websocketConnection = createAsyncAction(
  'connect/WS_REQUEST',
  'connect/WS_SUCCESS',
  'connect/WS_FAILURE',
)<void, Connection, Connection>();

export const newDataIncoming = createAction('connect/NEW_DATA_INCOMING', resolve =>
  (data: string) => resolve(data)
);

export const sendWebsocket = createAction('connect/SEND_WEBSOCKET', resolve =>
  (data: string) => resolve(data)
);

export const clearMessages = createAction('connect/CLEAR_MESSAGES', resolve =>
  () => resolve()
);

export const setState2 = createAction('connect/SET_STATE2', resolve =>
  (data: Object) => resolve(data)
);

export const clearReducerHistory = createAction('connect/CLEAR_REDUCER_HISTORY', resolve =>
  () => resolve()
);

export const stopWaiting = createAction('connect/STOP_WAITING', resolve =>
  () => resolve()
);

export const deleteActionPicture = createAction('connect/DELETE_ACTION_PICTURE', resolve =>
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
  (text: string | undefined) => resolve(text)
);

export const clearLog = createAction('connect/CLEAR_LOG', resolve =>
  () => resolve()
);