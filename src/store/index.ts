import { StateType } from 'typesafe-actions';
import { Middleware } from 'redux';

import rootReducer from './root-reducer';

import { fetchConnectionsMiddleware } from './connections/middleware';
import * as connectionSelectors from './connections/selectors';

import * as connectionActions from './connections/actions';

export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const selectors = {
  connection: connectionSelectors,
};

export const actions = {
  connection: connectionActions,
}

export const middlewares: Middleware[] = [
  fetchConnectionsMiddleware,
]

export type RootState = StateType<typeof rootReducer>;
