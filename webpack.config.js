require('dotenv').config()
const path = require('path')
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const stylesLoaders = (additional) => {
  const loaders = ["style-loader", "css-loader"]

  if (additional) {
    loaders.push(...additional)
  }

  return loaders
}

module.exports =
  {
    mode: process.env.NODE_ENV,
    output: {
      publicPath: "/",
      hotUpdateChunkFilename: '.hot/hot-update.js',
      hotUpdateMainFilename: '.hot/hot-update.json',
    },
    entry: {
      main: [
        'react-hot-loader/patch',
        path.join(__dirname, './src/index.tsx'),
        'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
      ],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  "@babel/preset-react",
                  "@babel/preset-typescript",
                ],
              },
            },
            {
              loader: "eslint-loader"
            }
          ],
        },
        {
          test: /\.css$/i,
          exclude: /node_modules/,
          use: stylesLoaders(),
        },
        {
          test: /\.s[ac]ss$/i,
          use: stylesLoaders(['sass-loader'])
        },
      ],
    },
    resolve: {
      alias: {
        root: __dirname,
        src: path.resolve(__dirname, 'src'),
      },
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./dist/index.html",
        favicon: "./src/images/cloudy.svg"
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
      new webpack.EnvironmentPlugin( { ...process.env } )
    ],
    devtool: "inline-source-map",
    devServer: {
      contentBase: path.join(__dirname, "build"),
      historyApiFallback: true,
      port: 4000,
      open: true,
      hot: true
    },
  }
