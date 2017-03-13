import { HashRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';

import locales from './locales';

export const Encapsulate = ({ children, locale, muiTheme }) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router>
      <IntlProvider locale={locale} messages={locales[locale]}>
        {children}
      </IntlProvider>
    </Router>
  </MuiThemeProvider>
);

Encapsulate.propTypes = {
  children: React.PropTypes.element.isRequired,
  locale: React.PropTypes.string.isRequired,
  muiTheme: React.PropTypes.object,
};
