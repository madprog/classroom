import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';

export const Encapsulate = ({ children }) => (
  <MuiThemeProvider>
    {children}
  </MuiThemeProvider>
);

Encapsulate.propTypes = {
  children: React.PropTypes.element.isRequired,
};
