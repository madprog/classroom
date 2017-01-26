/*global require*/
let testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
