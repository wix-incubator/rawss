'use strict';

const path = require('path');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
 
module.exports = {
    entry: {
        index: path.resolve('src/index.ts'),
        engine: path.resolve('src/engine.ts'),
        rawss: path.resolve('src/rawss.ts'),
        cssvar: path.resolve('src/cssvar.ts'),
        csspaint: path.resolve('src/csspaint.ts'),
        domUtils: path.resolve('src/domUtils.ts')
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    plugins: [
        new TypedocWebpackPlugin({
            readme: 'none', out: '../docs'
        }, ['./src/cssvar.ts', './src/rawss.ts', './src/index.ts'])
    ],
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /src\/.*\.ts$/, loader: 'ts-loader?'+JSON.stringify({
                compilerOptions: {
                    lib: ['es6', 'ES2015.Promise', 'DOM'],
                    types: ['node', 'mocha'],
                    target: 'es5'
                }
            })}
        ]
    },
    externals: {
        lodash : 'lodash'
    }
};
