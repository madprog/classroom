import { injectIntl, intlShape } from 'react-intl';
import React from 'react';
import { Route } from 'react-router';

import { AppBar } from 'material-ui';

const Root = ({ intl }) => (
  <div className="root">
    <Route path="/:section?" render={({ match: { params: { section } } }) => (
      <AppBar title={intl.formatMessage({ id: `${section || 'index'}.title` })} />
    )} />
  </div>
);

Root.propTypes = {
  intl: intlShape,
};

export default injectIntl(Root);
