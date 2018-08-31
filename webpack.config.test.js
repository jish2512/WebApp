const path = require('path');
const webpack = require('webpack');

module.exports = {
	//context: path.join(__dirname, 'wwwroot/js/resiliency'),
	//entry: './sampleTest.spec',
	//output: {
	//	filename: 'bundle.js',
	//	path: path.resolve(__dirname, 'dist')
	//},

	//don't include the vendor libs as it's handled by FXP
	externals: {
		angular: 'angular',
		jquery: 'jquery',
		'bootstrap-ui-datetime-picker': 'window["bootstrap-ui-datetime-picker"]',
		'currency-symbol-map': 'window["currency-symbol-map"]',
		moment: 'moment'
	},
	
    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.js', '.html']
    },

    module: {
        rules: [
            { 
				test: /\.ts$/, 
                loader: "@ngtools/webpack",
                options: {
                    "tsConfigPath": "src\\tsconfig.app.json",
                },
                exclude: /node_modules/ 
            }
        //    {
        //        test: /\.html$/,
        //       loader: 'html-loader'
		// 		include: path.join(__dirname, 'wwwroot/js/resiliency')
        //    }
    //        {
    //            test: /\.(css|scss|sass)$/,
    //           // loader: 'null-loader',
				////include: path.join(__dirname, 'wwwroot/js/resiliency')
    //        },
    //        {
    //            test: /\.(png|jpg)$/,
    //           // loader: 'null-loader',
				////include: path.join(__dirname, 'wwwroot/js/resiliency')
    //        }
        ]
    },
    plugins: [
        //Angular looks for window.jQuery in order to determine whether jQuery is present
        //new webpack.ProvidePlugin({
        //    'window.jQuery': 'jquery'
        //})
    ],
    //devServer: {
    //    contentBase: path.join(__dirname, "dist"),
    //    inline: true,
    //    stats: 'errors-only',
    //    overlay: {
    //        errors: true,
    //        warnings: false
    //    },
    //    headers: { 
    //        "Access-Control-Allow-Origin": "*",
    //        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    //        "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-CorrelationId, X-Requested-With, X-ActonBehalfMode, X-OnBehalfOfUser"
    //     }
    //}
}