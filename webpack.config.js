var path = require('path')
var webpack = require('webpack')
var HtmlPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var ExtractCSS = new ExtractTextPlugin('style/vendor.css')
var ExtractLESS = new ExtractTextPlugin('style/app.css')
var host = 'http://10.9.166.55:3000'

module.exports = {
  // 入口定义
  entry: {
  	app: './js/script/app.js',
    vendor: ['react', 'react-dom', 'react-router']

  },

  // 出口定义
  output: {
    path: __dirname + '/build',
    filename: 'script/[name].js'
  },

  // 定义模块
  module: {
    rules: [
      // 解析jsx
      {
        test: /\.(js|jsx)$/,
        exclude: [
          path.resolve(__dirname, "node_modules")
        ],
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },

      // 解析less, css
      {
        test: /\.less$/,
        loader: ExtractLESS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.css$/,
        loader: ExtractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
      },

      // 模块化图片
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              // limit: 8192,
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  // 定义webserver
  devServer: {
    contentBase: './build',
    host: 'localhost',   
    port: 5000,
    proxy: {
      '/api': {
        target: host+'/cars/goods',
        changeOrigin: true,
        pathRewrite: {'^/api': ''}
      },
      '/dpi': {
        target: host+'/cars/users',
        pathRewrite: {'^/dpi': ''}
      }
      // '/nodejs': {
      //   target: 'http://localhost:9000',
      //   changeOrigin: true,
      //   pathRewrite: {'^/nodejs': ''}
      // }
    }
  },

  plugins: [
    // 根据模板生成html
    new HtmlPlugin({
      template: './js/index.ejs',
      filename: 'index.html',
      title: '中车管理系统demo'
    }),

    // 抽离JS vender
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: Infinity
    }),

    // 抽离CSS vendor， less
    ExtractCSS,
    ExtractLESS
  ],
  // externals: {
  //   'react': 'window.React',
  //   'react-dom': 'window.ReactDOM'
  // }
}
