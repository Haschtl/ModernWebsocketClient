import { Action } from 'redux';
import connections, { connectionDefaultState } from './connections/reducer';

const rootReducer = (state: any, action: Action) => {
  if (state === undefined) {
    return {
      connections: connectionDefaultState
    }
  }
  
  return {
    connections: connections(state.connections, action)
  }
}

export default rootReducer;
