import { Encapsulate } from './utils';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';

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

export const init = () => {
  addLocaleData([
    ...en,
    ...es,
    ...fr,
    ...pl,
  ]);

  ReactDOM.render((
    <Encapsulate
      locale="en"
      muiTheme={theme}
    >
      <Root />
    </Encapsulate>
  ), document.getElementById('app'));
};

init();
