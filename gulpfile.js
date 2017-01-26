"use strict";
const { cordova } = require('cordova-lib');
const gulp = require('gulp');
const gutil = require('gulp-util');
const karma = require('karma');
const path = require('path');
const touch = require('touch');
const webpack = require('webpack');

const project_path = path.join(__dirname);
const webpack_config_path = path.join(project_path, 'webpack.config.js')
const project_test_index = path.join(project_path, 'tests', 'index.js');
const compiled_test_file = path.join(project_path, 'build', 'test', 'tests.js');

// WebpackBuilder(...) will return an object with two methods.
// run(done) will build the project once, whereas
// watch(options, done) will build it a first time, and at any source change.
// to rebuild it automatically (and fastly!)
// * patch_config(config): a method which may change the webpack configuration
const WebpackBuilder = (options) => {
  let {
    patch_config,
  } = options;

  let config = Object.assign({}, require(webpack_config_path));

  config.context = project_path; // source root directory
  config.output.path = path.join(config.context, config.output.path);
  // Generate a source-map
  config.devtool = 'source-map';

  if (patch_config) {
    patch_config(config);
  }

  let webpack_builder = webpack(config);

  const on_built = (cb, reset) => (err, stats) => {
    if (err) {
      if (cb) {
        err.showStack = false;
        cb(err);
      } else {
        gutil.log('[webpack] ' + err.name + ': ' + err.message);
      }
      if (reset) {
        setTimeout(() => {
          // Webpack has failed and needs to be reset
          webpack_builder = webpack(config);
          reset();
        }, 1000);
      }
      return;
    } else {
      let jsonStats = stats.toJson();
      if (jsonStats.errors.length > 0) {
        if (cb) {
          cb({
            showStack: false,
            toString: () => jsonStats.errors.join('\n'),
          });
        } else {
          gutil.log(jsonStats.errors.join('\n'));
        }
        return;
      }
      if (jsonStats.warnings.length > 0) {
        gutil.log(jsonStats.warnings.join('\n'));
      }
      stats.toString({
        chunks: false,
        colors: true,
      }).split('\n').map(line => gutil.log('[webpack] ' + line));
      for (let asset of jsonStats.assets) {
        if (!asset.emitted) {
          touch.sync(path.join(config.output.path, asset.name));
        }
      }

      if (cb) {
        cb();
      }
    }
  };

  return {
    run(cb) { return webpack_builder.run(on_built(cb)); },
    watch(options, cb) { return webpack_builder.watch(options, on_built(cb, () => watch(options, cb))); },
  };
};

// WebpackTestBuilder(...) inherits from WebpackBuilder, and builds the tests
// instead of the project itself.
const WebpackTestBuilder = options => {
  let {
    project,
    patch_config,
  } = options;

  return WebpackBuilder({
    project,
    patch_config: config => {
      config.entry = './' + path.relative(config.context, project_test_index);
      config.module.loaders.push({
          test: /\.json$/,
          exclude: /node_modules/,
          loader: 'json-loader',
        },
        {
          test: /tests\/assets/,
          exclude: [/node_modules/, /\.json$/, /\.js$/],
          loader: 'file-loader',
        });
      let output_path = compiled_test_file;
      config.output.path = path.dirname(output_path);
      config.output.filename = path.basename(output_path);

      // enzyme needs this according to https://github.com/airbnb/enzyme/issues/47#issuecomment-207498885
      config.module.loaders = (config.module.loaders || []).concat([{ test: /\.json$/, loader: 'json' }]);
      config.externals = Object.assign(config.externals || {}, {
        ['react/addons']: true,
        ['react/lib/ExecutionEnvironment']: true,
        ['react/lib/ReactContext']: true,
      });

      // Generate a source-map
      config.devtool = 'source-map';

      if (patch_config) {
        patch_config(config);
      }
    },
  });
};

// KarmaServer(...) will return a new Karma.Server instance
// configured to run our tests
const KarmaServer = (options, done) => {
  let project = options.project,
    watch = options.watch;

  let server = new karma.Server({
    browsers: ['PhantomJS'],
    files: [
      compiled_test_file,
    ],
    frameworks: ['jasmine-ajax', 'jasmine'],
    preprocessors: {
      [compiled_test_file]: ['sourcemap'],
    },
    reporters: ['jasmine-diff', 'dots'],
    singleRun: !watch,
    autoWatchBatchDelay: 1000,
    mochaReporter: {
      output: 'minimal',
      ignoreSkipped: true,
    },
    jasmineDiffReporter: {
      pretty: true,
      color: {
        expectedFg: 'black',
        expectedBg: 'bgRed',
        actualFg:   'black',
        actualBg:   'bgGreen',
      },
    },
    proxies: {
      '/img': '/base/comex/frontend/tests/assets/img',
      '/imgbig/': '/base/comex/frontend/tests/assets/imgbig/',
      '/assets/': '/base/comex/frontend/tests/assets/img/',
    },
  }, done);

  server.on('run_start', () => gutil.log('[karma] run start'));
  server.on('run_complete', () => gutil.log('[karma] run complete'));

  return server
};

const afterBuild = (done, error) => {
  if (!done && error) {
    gutil.log(error.toString());
  }

  if (error) {
    if (done) {
      done(error);
    }
  } else {
    cordova.prepare(() => {
      if (done) {
        done();
      }
    });
  }
}

const doBuild = done => {
  WebpackBuilder({}).run(afterBuild.bind(null, done));
};

const doBuildWatch = done => {
  let watching;
  let webpack_builder = WebpackBuilder({});

  // Stop the builder when user hits ^C
  process.on('SIGINT', () => {
    watching.close(() => {
      done();
      process.exit();
    });
  });

  watching = webpack_builder.watch({
    poll: true,
  }, afterBuild.bind(null, undefined));
};

const doTestBuild = done => {
  WebpackTestBuilder({}).run(done);
};

const doTest = done => {
  KarmaServer({ watch: false, }, exitCode => {
    if (exitCode == 0) {
      done();
    } else {
      done({
        showStack: false,
        toString() { return 'Something happened with Karma'; },
      });
    }
  }).start();
};

const doTestWatch = done => {
  let watching,
      webpack_builder,
      karma_server,
      first_run = true;

  webpack_builder = WebpackTestBuilder({});

  // When ^C kills the karma server,
  // watching.close() will cleanly stop webpack too
  karma_server = KarmaServer({
    watch: true,
  }, () => watching.close(done));

  // Wait for the first build to be finished
  // before running the karma server
  watching = webpack_builder.watch({
    poll: true,
  }, (err) => {
    if (err) {
      gutil.log(err.toString());
    } else if (first_run) {
      first_run = false;
      karma_server.start();
    }
  });
};

/*********** TASKS ***********/
// task build will build the web assets for the backend project
gulp.task('build', doBuild);

// task build:watch will build the web assets for the backend project
// and update them when a source file was rewritten
gulp.task('build:watch', doBuildWatch);

// task test:build will build the tests for this project
// (but won't run them)
gulp.task('test:build', doTestBuild);

// task test will build and run the tests for this project
gulp.task('test', ['test:build'], doTest);

// task test:watch will build and run the tests for this project
// and run them again when a source file was changed
gulp.task('test:watch', doTestWatch);
