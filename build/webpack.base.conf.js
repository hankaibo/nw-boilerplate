const path = require('path');
const nodeExternals = require('webpack-node-externals');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const translateEnvToMode = env => {
  if (env === 'production') {
    return 'production';
  }
  return 'development';
};

module.exports = env => {
  return {
    entry: {
      app: './src/app.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../app')
    },
    target: 'node-webkit',
    mode: translateEnvToMode(env),
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [nodeExternals()],
    resolve: {
      alias: {
        env: path.resolve(__dirname, `../config/env_${env}.json`),
        pkg: path.resolve(__dirname, '../package.json')
      }
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        }
      ]
    },
    plugins: [new FriendlyErrorsWebpackPlugin({ clearConsole: env === 'development' })]
  };
};
