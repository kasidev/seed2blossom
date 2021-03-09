const path = require('path');
const webpack = require('webpack');

module.exports = {

  module: {
		rules: [
			{
				test: /\.ejs$/, loader: 'ejs-webpack-loader'
			}
		]
	},


  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public/dist'),
  }
  
};