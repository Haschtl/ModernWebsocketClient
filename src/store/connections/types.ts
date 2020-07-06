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
  messages: Message[],
  password: string,
  beautify: boolean,
  binaryType: "int8"|"uint8"|"int16"|"uint16"|"int32"|"uint32"|"float32"|"float64"|"bigint64"|"biguint64",
  binaryOffset: number
}

export interface ConnectionState {
  connections: Connection[];
  currentChat?: number;
  history?: string;
  config?: any;
  theme: Theme,
  tutorials: Tutorial[],
  version: string,
  protocolPresets: [string, Command[]][]
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
  msg?: MessageEvent,
  typ: "string"|"binary"
  text: string,
}

export interface Command {
  value: string,
  num: number
}