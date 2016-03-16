var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')

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
            {test: /\.css$/,  loaders: ['style', 'css']},
            {test: /\.scss$/, loaders: ['style', 'css', 'sass']},
            {test: /\.jsx?$/, loader: 'babel', exclude: /(node_modules|bower_components)/, query: {presets: ['react', 'es2015']}}
        ]
    },
    plugins: [
        new CopyWebpackPlugin(
            [
                {from: 'index.html'}
            ]
        )
    ]
}
