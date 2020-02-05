export interface Connection {
  name: string,
  host: string,
  port: number,
  timeout: number,
  id: number,
  connected: boolean,
  commands: Command[],
  info: string,
  autoconnect: boolean,
  ssl: boolean,
  ws?: WebSocket,
  chatInput?: string,
  messages: Message[]
}

export interface ConnectionState {
  connections: Connection[];
  history?: string;
  config?: any;
  theme: Theme,
  tutorials: Tutorial[],
  version: string
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
  // member: Connection | {id: -1, name: 'Me'},
  member: {id: number},
  date?: number,
  text: string,
}

export interface Command {
  value: string,
  num: number
}