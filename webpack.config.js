var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var OpenBrowserPlugin = require('open-browser-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    context: path.resolve(__dirname, 'app'),
    devtool: '#source-map',
    entry: './entry.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.css$/,  loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
            {test: /\.scss$/, loaders: ['style', 'css', 'sass']},
            {test: /\.jsx?$/, loaders: ['babel'], exclude: /(node_modules|bower_components)/}
        ]
    },
    plugins: [
        new CopyWebpackPlugin(
            [
                {from: 'index.html'}
            ]
        ),
        new OpenBrowserPlugin(
            {
                url: 'http://localhost:8080'
            }
        ),
        new ExtractTextPlugin('bundle.css')
    ]
}
