// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {AppContainer} from 'react-hot-loader';
import AppReduxProvider, {initializeStore} from './component/appReduxProvider';
import AppRouter from './component/appRouter';
import registerServiceWorker from './registerServiceWorker';
import {initialize as electron_initialize} from 'src/_core/electron';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Setup use of Electron in React
 * electron_initialize() must be called at the start to allow
 * utils/electron.js to return electron within the application.
 */
electron_initialize();
initializeStore();
const root: ?Element = document.getElementById('root');

try {
  /**
   * Render the application
   */

  if (root != null) {
    ReactDOM.render(
        <AppContainer>
          <AppReduxProvider>
            <AppRouter/>
          </AppReduxProvider>
        </AppContainer>, root);
  }
} catch (exc) {
  if (root != null)
    ReactDOM.render(<div>
          <h1>An error occurred</h1>
        </div>,
        root);
}

registerServiceWorker();