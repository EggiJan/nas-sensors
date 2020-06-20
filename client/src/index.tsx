import * as React from 'react'
import ReactDOM from 'react-dom';
import { AuthContextProvider } from './components/AuthenticationContext';
import "./index.css";
import history from "./utils/history";
import App from './app';

const onRedirectCallback = (appState: any) => {
  console.log('onRedirectCallback', appState);
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const domContainer = document.getElementById('app');

ReactDOM.render(
  <AuthContextProvider onRedirectCallback={onRedirectCallback}>
    <App />
  </AuthContextProvider>,
  domContainer
);
