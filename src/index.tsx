import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import store from './store';
import { Provider } from 'react-redux';
import './i18n';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// Call the element loader after the app has been rendered the first time
// defineCustomElements(window);

serviceWorker.register();

