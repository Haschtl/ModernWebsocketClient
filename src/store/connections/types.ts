export interface Connection {
  name: string,
  host: string,
  port: number,
  timeout: number,
  id: number,
  connected: boolean,
  commands: Command[],
  info: string,
  eventlevel: -1 | 0 | 1 | 2,
  accesslevel: 'expert' | 'simple'
  autoconnect: boolean,
  ssl: boolean
}

export interface ConnectionState {
  connections: Connection[];
  chatInput?: string;
  ws?: WebSocket;
  active?: Connection;
  history?: string;
  config?: any;
  messages: Message[],
  waiting: boolean;
    maxN: number;
  zoomArgument: boolean;
  panArgument: boolean;
  zoomValue: boolean;
  panValue: boolean;
  userActions: any[];
  actionPicture?: string;
  theme: Theme,
  tutorials: Tutorial[],
  version: string,
  log: string[]
}

export type Theme= 'dark-theme' | 'light-theme' | 'blackwhite-theme' | 'oled-theme' | 'green-theme' | 'medium-theme'

export interface Tutorial {
  id: number,
  text: string | JSX.Element,
  title: string | JSX.Element,
  video: string,
  custom: JSX.Element,
  group: 'connections'  | 'app'
}

export interface Message {
  member: Connection | {id: -1, name: 'Me'},
  date?: number,
  text: string,
}

export interface Command {
  value: string,
  num: number
}