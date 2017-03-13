import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Encapsulate } from './utils';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';

import reducer from './reducer';
import Root from './root';
import theme from './theme';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import pl from 'react-intl/locale-data/pl';

import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

const middlewares = [
  thunkMiddleware,
  promiseMiddleware({
    promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']
  }),
];

export const init = () => {
  addLocaleData([
    ...en,
    ...es,
    ...fr,
    ...pl,
  ]);

  const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)));

  ReactDOM.render((
    <Encapsulate
      locale="en"
      muiTheme={theme}
      store={store}
    >
      <Root />
    </Encapsulate>
  ), document.getElementById('app'));
};

init();
