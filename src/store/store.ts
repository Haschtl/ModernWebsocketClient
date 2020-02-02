import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { fetchConnectionsMiddleware } from './connections/middleware';

import rootReducer from './root-reducer';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares: Middleware[] = [
  fetchConnectionsMiddleware,
];

function configureStore(initialState?: any) {
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
}

// pass an optional param to rehydrate state on app start
const store = configureStore();

// export store singleton instance
export default store;
