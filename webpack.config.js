var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	context: path.join(__dirname + '/src'),
	entry: './main.js',
	output: {
		path: __dirname + '/dist',
		filename: 'main.js'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
			},
			{
				test: /\.html$/,
				loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './src')) + '/!html'
			},
			{ 
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]" 
			},
			{ 
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: "file-loader?name=[name].[ext]"
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css'),
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		})
	]
};
