import path from 'path';
import { Configuration } from 'webpack';
import WebpackDevServer from "webpack-dev-server";

// Required to prevent error
// error ___ ___ ___ 
//  Object literal may only specify known properties,
//  and 'devServer' does not exist in type 'Configuration'.ts
declare module "webpack" {
	interface Configuration {
		devServer?: WebpackDevServer.Configuration;
	}
}

const config: Configuration = {
    context : path.join(__dirname, 'src'),
    entry   : './index.tsx',
    output  : {
        path        : path.join(__dirname, 'dist'),
        filename    : 'bundle.js',
        publicPath  : '/dist',
    },
    module: {
        rules: [
            {
                test    : /\.tsx?$/,
                use     : 'ts-loader',
            },
        ],
    },
    mode: "development",
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    devtool: "inline-source-map",
    devServer: {
        static  : { directory: path.join(__dirname, "static") },
        open    : true,
        port    : 3000,
    },
};

export default config;