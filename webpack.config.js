// // const path = require('path');
// // const HtmlWebpackPlugin = require('html-webpack-plugin');
// // const { VueLoaderPlugin } = require('vue-loader'); // Import VueLoaderPlugin

// // module.exports = {
// //   mode: 'development',
// //   entry: './src/index.js',
// //   output: {
// //     filename: 'bundle.js',
// //     path: path.resolve(__dirname, 'dist'),
// //   },
// //   devtool: 'source-map',
// //   module: {
// //     rules: [
// //       {
// //         test: /\.js$/,
// //         exclude: /node_modules/,
// //         use: {
// //           loader: 'babel-loader',
// //           options: {
// //             presets: ['@babel/preset-env']
// //           }
// //         }
// //       },
// //       {
// //         test: /\.vue$/, // Add Vue-loader for .vue files
// //         loader: 'vue-loader'
// //       },
// //       {
// //         test: /\.css$/,
// //         use: ['style-loader', 'css-loader'],
// //       },
// //     ],
// //   },
// //   plugins: [
// //     new VueLoaderPlugin(), // Add VueLoaderPlugin
// //     new HtmlWebpackPlugin({
// //       template: './index.html'
// //     })
// //   ],
// //   devServer: {
// //     static: {
// //       directory: path.join(__dirname, 'dist'),
// //     },
// //     port: 9001,
// //     hot: true,
// //     open: true,
// //   },
// // };


// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { VueLoaderPlugin } = require('vue-loader'); // Import VueLoaderPlugin

// module.exports = {
//   mode: 'development',
//   entry: './src/index.js',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
//   devtool: 'source-map',
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       },
//       {
//         test: /\.vue$/, // Add Vue-loader for .vue files
//         loader: 'vue-loader'
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//       {
//         test: /pdf\.worker\.js$/,
//         use: {
//           loader: 'file-loader',
//           options: {
//             name: '[name].[ext]',
//           },
//         },
//       },
//     ],
//   },
//   plugins: [
//     new VueLoaderPlugin(), // Add VueLoaderPlugin
//     new HtmlWebpackPlugin({
//       template: './index.html'
//     })
//   ],
//   devServer: {
//     static: {
//       directory: path.join(__dirname, 'dist'),
//     },
//     port: 9001,
//     hot: true,
//     open: true,
//   },
// };

// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { VueLoaderPlugin } = require('vue-loader');
// const webpack = require('webpack');

// module.exports = {
//   mode: 'development',
//   entry: './src/index.js',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
//   resolve: {
//     fallback: {
//       "util": require.resolve("util/"),
//       "process": require.resolve("process/browser")
//     }
//   },
//   devtool: 'source-map',
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       },
//       {
//         test: /\.vue$/,
//         loader: 'vue-loader'
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//       {
//         test: /\.(png|jpe?g|gif|svg)$/i,
//         use: [
//           {
//             loader: 'file-loader',
//             options: {
//               name: '[name].[ext]',
//               outputPath: 'images/',
//               publicPath: 'images/'
//             },
//           },
//         ],
//       },
//       // { test: /\.svg$/, loader: 'svg-inline-loader' }
//     ],
//   },
//   plugins: [
//     new webpack.ProvidePlugin({
//       process: 'process/browser',
//     }),
//     new VueLoaderPlugin(),
//     new HtmlWebpackPlugin({
//       template: './index.html'
//     })
//   ],
//   devServer: {
//     static: {
//       directory: path.join(__dirname, 'dist'),
//     },
//     port: 9001,
//     hot: true,
//     open: true,
//   },
// };


const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
      util: require.resolve('util/'),
      process: require.resolve('process/browser'),
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 9001,
    hot: true,
    open: true,
  },
};
