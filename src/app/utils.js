import { connect, Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';

const Encapsulate = ({ children, locale, messages, muiTheme, store }) => (
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router>
        <IntlProvider locale={locale} messages={messages}>
          {children}
        </IntlProvider>
      </Router>
    </MuiThemeProvider>
  </Provider>
);

Encapsulate.propTypes = {
  children: React.PropTypes.element.isRequired,
  locale: React.PropTypes.string.isRequired,
  messages: React.PropTypes.objectOf(React.PropTypes.string).isRequired,
  muiTheme: React.PropTypes.object,
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  locale: state.i18n.locale,
  messages: state.i18n.messages,
});

const ConnectedEncapsulate = connect(mapStateToProps)(Encapsulate);

export { ConnectedEncapsulate as Encapsulate };
