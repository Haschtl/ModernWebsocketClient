import { Connection, Tutorial } from './types';

export function connectionByID(connections: Connection[], id: number) {
  return connections.find((s:Connection) => s.id === id);
}

export function tutorialByID(tuts: Tutorial[], id: number) {
  return tuts.find((s:Tutorial) => s.id === id);
}