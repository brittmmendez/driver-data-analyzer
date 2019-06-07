const buildPath = 'build';
const DashboardPlugin = require('webpack-dashboard/plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

// This is an exact copy of the NodeJS ’path’ module published to the NPM registry.
const PATHS = {
  app: __dirname,
  build: `${__dirname}/${buildPath}`,
  fixedPath: '/src'
};
const commonConfig = merge([
  parts.loadResolver(),
  parts.loadIcos(
    { include: PATHS.app, exclude: /node_modules/ },
    parts.loadSvgs({ exclude: /node_modules/ })
  ),
  parts.setEnv()
]);

const productionConfig = merge([
  {
    mode: 'production',
    stats: 'errors-only',
    bail: true,
    watch: false,
    entry: {
      application: [
        '@babel/polyfill',
        './src/index.js'
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      publicPath: '/',
      path: PATHS.build
    }
  },
  parts.setNoErrors(),
  parts.loadImages({ exclude: /node_modules/ }),
  parts.loadJavaScript({ include: `${__dirname}/`, exclude: /node_modules/ }),
  parts.minifyJavaScript(),
  parts.clean(PATHS.build),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true
    }
  }),
  parts.loadProdCss(),
  parts.loadHtml({ include: `${__dirname}/`, exclude: /node_modules/ }),
  parts.loadRobotsTxt(),
  // parts.runCritical(),
  parts.setCompression(),
  parts.copyToRoot()
]);

// If you aren't using express, add it to your webpack configs plugins section
const developmentConfig = merge([
  {
    mode: 'development',
    bail: true,
    watch: true,
    performance: {
      hints: false
    },
    entry: {
      application: [
        '@babel/polyfill',
        'whatwg-fetch',
        './src/index.js'
      ]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      path: PATHS.build,
      pathinfo: true,
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: 'babel-loader'
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devtool: 'source-map',
    plugins: [new DashboardPlugin()]
  },
  parts.loadImagesDev({ include: `${__dirname}`, exclude: /node_modules/ }),
  parts.devServer(),
  parts.loadJavaScript({ include: `${__dirname}/`, exclude: /node_modules/ }),
  parts.loadDevCss({
    exclude: /fonts/,
    options: {
      sourceMap: true,
      minimize: false
    }
  }),
  parts.loadHtml({
    include: `${__dirname}/`,
    exclude: [/node_modules/, /images/]
  }),
  parts.loadRobotsTxt(),
  parts.generateSourceMaps()
]);

module.exports = mode => {
  const config = mode || process.env.NODE_ENV;
  let modeConfig = developmentConfig;
  if (config === 'production' || config === 'test') {
    modeConfig = productionConfig;
  }
  return merge(commonConfig, modeConfig);
};
