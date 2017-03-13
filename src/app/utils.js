import { connect, Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';

import locales from './locales';

const Encapsulate = ({ children, locale, muiTheme, store }) => (
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router>
        <IntlProvider locale={locale} messages={locales[locale]}>
          {children}
        </IntlProvider>
      </Router>
    </MuiThemeProvider>
  </Provider>
);

Encapsulate.propTypes = {
  children: React.PropTypes.element.isRequired,
  locale: React.PropTypes.string.isRequired,
  muiTheme: React.PropTypes.object,
  store: React.PropTypes.object.isRequired,
};

const ConnectedEncapsulate = connect()(Encapsulate);

export { ConnectedEncapsulate as Encapsulate };
