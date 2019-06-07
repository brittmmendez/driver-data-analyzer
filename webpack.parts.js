const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CompressionPlugin = require('compression-webpack-plugin');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const RobotstxtPlugin = require("robotstxt-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const CriticalCssPlugin = require('critical-css-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const devdotenv = require('dotenv').config({
  path: __dirname + '/.env.development'
});
const stagedotenv = require('dotenv').config({
  path: __dirname + '/.env.stage'
});
const dotenv = require('dotenv').config({
  path: `${__dirname}/.env`
});

exports.loadResolver = () => ({
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src/')
    }
  }
});

exports.loadJavaScript = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include,
        exclude,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
});

exports.devServer = () => ({
  serve: {
    add: app => {
      const historyOptions = {
        // ... see: https://github.com/bripkens/connect-history-api-fallback#options
      };

      app.use(convert(history(historyOptions)));
    },
    port: 3000,
    dev: {
      publicPath: '/'
    },
    historyApiFallback: true,
    clipboard: false,
    open: true,
    hot: true
  }
});

exports.loadProdCss = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        include,
        exclude,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
});

exports.loadDevCss = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        include,
        exclude,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader'
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
});

exports.loadRobotsTxt = () => ({
  plugins: [
    new RobotstxtPlugin({
      filename: './public/robots.txt'
    })
  ]
});

exports.loadHtml = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.html$/,
        include,
        exclude,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: false }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      favicon: './public/favicon.ico',
      template: './public/index.html',
      filename: './index.html',
    })
  ]
});

exports.loadIcos = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.ico$/,
        include,
        exclude,
        use: {
          loader: 'file-loader?name=[name].[ext]'
        }
      }
    ]
  }
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg|woff|woff2|ttf|eot)$/i,
        include,
        exclude,
        options,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          },
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              publicPath: '/'
            }
          }
        ]
      }
    ]
  }
});

exports.loadImagesDev = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg|woff|woff2|ttf|eot)$/i,
        include,
        exclude,
        options,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            publicPath: '/'
          }
        }
      }
    ]
  }
});

// When your source code has gone through transformations, debugging becomes a problem. When
// debugging in a browser, how to tell where the original code is? Source maps solve this
// problem by providing a mapping between the original and the transformed source code.
// In addition to source compiling to JavaScript, this works for styling as well.
//
// One approach is to skip source maps during development and rely on browser support of language
// features. If you use ES2015 without any extensions and develop using a modern browser, this can
// work. The advantage of doing this is that you avoid all the problems related to source maps
// while gaining better performance.
//
// If you are using webpack 4 and the new mode option, the tool will generate source maps
// automatically for you in development mode. Production usage requires attention, though.
exports.generateSourceMaps = () => ({
  devtool: 'source-map'
});

// Cleaning the Build Directory#
// The current setup doesn't clean the build directory between builds. As a result, it
// keeps on accumulating files as the project changes. Given this can get annoying, you
// should clean it up in between.
//
// Another nice touch would be to include information about the build itself to the generated
// bundles as a small comment at the top of each file including version information at least.
exports.clean = webPath => ({
  plugins: [new CleanWebpackPlugin([webPath])]
});

// This plugin uses UglifyJS v3 (uglify-es) to minify your JavaScript
exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [
      new UglifyWebpackPlugin({
        sourceMap: true,
        extractComments: true,
        parallel: true,
        exclude: /models/
      })
    ]
  }
});

// Webpack allows a couple ways to load SVGs. However, the easiest way is through file-loader as follows:
//
// {
//   test: /\.svg$/,
//   use: "file-loader",
// },
// react-svg-loader emits SVGs as React components meaning you could end up with code like <Image width={50} height={50}/> to render a SVG in your code after importing it.
exports.loadSvgs = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.svg$/,
        include,
        exclude,
        use: [
          'babel-loader',
          {
            loader: 'react-svg-loader',
            options: {
              svgo: {
                plugins: [{ cleanupIDs: false }],
                floatPrecision: 2
              }
            }
          }
        ]
      }
    ]
  }
});

// Minifying CSS
// css-loader allows minifying CSS through cssnano. Minification needs to be
// enabled explicitly using the minimize option. You can also pass cssnano specific
// options to the query to customize the behavior further.
//
// clean-css-loader allows you to use a popular CSS minifier clean-css.
//
// optimize-css-assets-webpack-plugin is a plugin based option that applies a chosen
// minifier on CSS assets. Using ExtractTextPlugin can lead to duplicated CSS given it
// only merges text chunks. OptimizeCSSAssetsPlugin avoids this problem by operating
// on the generated result and thus can lead to a better result.
exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
});

// Use the NoEmitOnErrorsPlugin to skip the emitting phase whenever there are errors while compiling.
// This ensures that no assets are emitted that include errors. The emitted flag in the stats is false
// for all assets.
exports.setNoErrors = () => new webpack.NoEmitOnErrorsPlugin();

// Prepare compressed versions of assets to serve them with Content-Encoding
exports.setCompression = () => ({
  plugins: [new CompressionPlugin()]
});

// Critical-CSS will inline the most important css for initial pageloads
exports.runCritical = () => ({
  plugins: [
    new CriticalCssPlugin({
      base: './build'
    })
  ]
});
// This module will help you:
//
// Realize what's really inside your bundle
// Find out what modules make up the most of its size
// Find modules that got there by mistake
// Optimize it!
// And the best thing is it supports minified bundles! It parses them to get real size of bundled
// modules. And it also shows their gzipped sizes!
exports.setAnalyzer = () => ({
  plugins: [new BundleAnalyzerPlugin()]
});

// This plugin will cause hashes to be based on the relative path of the module,
// generating a four character string as the module id. Suggested for use in production.
exports.setHashModuleIds = () => ({
  plugins: [
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    })
  ]
});

// The setEnvVars functions allow environment variables to be used within the MobX State Tree models. Without these, a type error would occur
exports.setEnv = () => {
  if (process.env.API_TARGET === 'prod') {
    return {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(dotenv.parsed)
        })
      ]
    };
  } else if (process.env.API_TARGET === 'staging') {
    return {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(stagedotenv.parsed)
        })
      ]
    };
  }
  return {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(devdotenv.parsed)
      })
    ]
  };
};

exports.copyToRoot = () => ({
  plugins: [
    new CopyPlugin([
      { from: './public/robots.txt', to: '' },
      { from: './public/sitemap.xml', to: '' }
    ])
  ]
});
