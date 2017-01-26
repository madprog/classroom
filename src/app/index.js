import { Encapsulate } from './utils';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './root';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export const init = () => {
  ReactDOM.render((
    <Encapsulate>
      <Root />
    </Encapsulate>
  ), document.getElementById('app'));
};

init();
