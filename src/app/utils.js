import { HashRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';

export const Encapsulate = ({ children, muiTheme }) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router>
      {children}
    </Router>
  </MuiThemeProvider>
);

Encapsulate.propTypes = {
  children: React.PropTypes.element.isRequired,
  muiTheme: React.PropTypes.object,
};
